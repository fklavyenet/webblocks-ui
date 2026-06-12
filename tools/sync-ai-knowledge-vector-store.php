#!/usr/bin/env php
<?php
declare(strict_types=1);

const OUT_DIR = 'build/ai-knowledge';
const PLAN_PATH = 'build/ai-knowledge/vector-store-sync-plan.json';
const REPORT_PATH = 'build/ai-knowledge/vector-store-sync-report.json';
const STATE_PATH = 'build/ai-knowledge/vector-store-sync-state.json';
const OPENAI_API_BASE = 'https://api.openai.com/v1';

function usage(): string
{
    return implode(PHP_EOL, [
        'Usage:',
        '  php tools/sync-ai-knowledge-vector-store.php --dry-run',
        '  php tools/sync-ai-knowledge-vector-store.php --apply',
        '',
        'Default mode is --dry-run. --apply requires OPENAI_API_KEY and WEBBLOCKS_UI_VECTOR_STORE_ID.',
    ]) . PHP_EOL;
}

function fail(string $message, int $exitCode = 1): never
{
    fwrite(STDERR, 'FAIL: ' . $message . PHP_EOL);
    exit($exitCode);
}

function now_utc(): string
{
    return gmdate('Y-m-d\TH:i:s\Z');
}

function read_json_file(string $path): array
{
    if (!is_file($path)) {
        fail($path . ' is missing. Run ./tools/export-ai-knowledge.sh first.');
    }

    $raw = file_get_contents($path);
    if ($raw === false) {
        fail('unable to read ' . $path);
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        fail($path . ' is not valid JSON: ' . json_last_error_msg());
    }

    return $data;
}

function write_json_file(string $path, array $data): void
{
    $dir = dirname($path);
    if (!is_dir($dir) && !mkdir($dir, 0775, true)) {
        fail('unable to create ' . $dir);
    }

    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL;
    if (file_put_contents($path, $json) === false) {
        fail('unable to write ' . $path);
    }
}

function repo_root_guard(): void
{
    if (!is_file('ai/knowledge-map.json') || !is_file(PLAN_PATH)) {
        fail('run this script from the WebBlocks UI repository root.');
    }
}

function parse_mode(array $argv): string
{
    $mode = 'dry-run';
    foreach (array_slice($argv, 1) as $arg) {
        if ($arg === '--dry-run') {
            $mode = 'dry-run';
            continue;
        }
        if ($arg === '--apply') {
            $mode = 'apply';
            continue;
        }
        if ($arg === '--help' || $arg === '-h') {
            fwrite(STDOUT, usage());
            exit(0);
        }
        fail('unknown argument: ' . $arg . PHP_EOL . usage());
    }

    return $mode;
}

function validate_plan_file(array $entry): array
{
    $path = (string)($entry['file_path'] ?? '');
    $expectedSha = (string)($entry['sha256'] ?? '');
    $expectedBytes = $entry['bytes'] ?? null;
    $errors = [];

    if ($path === '' || str_starts_with($path, '/') || str_contains($path, '..')) {
        $errors[] = 'invalid file_path';
    }
    if (!preg_match('/^[a-f0-9]{64}$/', $expectedSha)) {
        $errors[] = 'invalid sha256 metadata';
    }
    if (!is_int($expectedBytes) || $expectedBytes < 0) {
        $errors[] = 'invalid bytes metadata';
    }

    $exists = $path !== '' && is_file($path);
    $actualBytes = null;
    $actualSha = null;

    if (!$exists) {
        $errors[] = 'missing file';
    } else {
        $actualBytes = filesize($path);
        $actualSha = hash_file('sha256', $path);

        if ($actualBytes !== $expectedBytes) {
            $errors[] = 'bytes mismatch';
        }
        if ($actualSha !== $expectedSha) {
            $errors[] = 'sha256 mismatch';
        }
    }

    return [
        'file_path' => $path,
        'source_path' => $entry['source_path'] ?? null,
        'source_group' => $entry['source_group'] ?? null,
        'content_type' => $entry['content_type'] ?? null,
        'priority' => $entry['priority'] ?? null,
        'sha256' => $expectedSha,
        'bytes' => $expectedBytes,
        'actual_sha256' => $actualSha,
        'actual_bytes' => $actualBytes,
        'exists' => $exists,
        'status' => $errors === [] ? 'ready' : 'error',
        'errors' => $errors,
    ];
}

function validate_plan_files(array $plan): array
{
    if (!isset($plan['files']) || !is_array($plan['files'])) {
        fail(PLAN_PATH . ' must contain a files array.');
    }

    $files = [];
    $totalBytes = 0;
    $errorCount = 0;

    foreach ($plan['files'] as $entry) {
        if (!is_array($entry)) {
            $files[] = [
                'file_path' => null,
                'status' => 'error',
                'errors' => ['invalid file entry'],
            ];
            $errorCount++;
            continue;
        }

        $file = validate_plan_file($entry);
        if ($file['status'] === 'ready') {
            $totalBytes += (int)$file['bytes'];
        } else {
            $errorCount++;
        }
        $files[] = $file;
    }

    return [$files, $totalBytes, $errorCount];
}

function read_state(): array
{
    if (!is_file(STATE_PATH)) {
        return [
            'schema_version' => 1,
            'updated_at' => null,
            'files' => [],
        ];
    }

    $state = read_json_file(STATE_PATH);
    if (!isset($state['files']) || !is_array($state['files'])) {
        $state['files'] = [];
    }

    return $state;
}

function state_by_sha(array $state): array
{
    $bySha = [];
    foreach ($state['files'] as $file) {
        if (is_array($file) && isset($file['sha256']) && is_string($file['sha256'])) {
            $bySha[$file['sha256']] = $file;
        }
    }

    return $bySha;
}

function env_required(string $name): string
{
    $value = getenv($name);
    if (!is_string($value) || trim($value) === '') {
        fail($name . ' is required for --apply.');
    }

    return trim($value);
}

function openai_request(string $method, string $path, string $apiKey, array $options = []): array
{
    if (!function_exists('curl_init')) {
        fail('PHP curl extension is required for --apply.');
    }

    $ch = curl_init(OPENAI_API_BASE . $path);
    if ($ch === false) {
        fail('unable to initialize curl.');
    }

    $headers = [
        'Authorization: Bearer ' . $apiKey,
    ];

    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 120);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    if (isset($options['multipart'])) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $options['multipart']);
    } elseif (isset($options['json'])) {
        $headers[] = 'Content-Type: application/json';
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($options['json'], JSON_UNESCAPED_SLASHES));
    }

    $raw = curl_exec($ch);
    $curlError = curl_error($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);

    if ($raw === false) {
        return [
            'ok' => false,
            'status' => 0,
            'error' => $curlError !== '' ? $curlError : 'curl request failed',
            'data' => null,
        ];
    }

    $data = json_decode((string)$raw, true);
    if (!is_array($data)) {
        $data = ['raw' => (string)$raw];
    }

    if ($status < 200 || $status >= 300) {
        $message = $data['error']['message'] ?? $data['error'] ?? 'OpenAI API request failed';
        return [
            'ok' => false,
            'status' => $status,
            'error' => is_string($message) ? $message : 'OpenAI API request failed',
            'data' => $data,
        ];
    }

    return [
        'ok' => true,
        'status' => $status,
        'error' => null,
        'data' => $data,
    ];
}

function upload_file(string $apiKey, string $path): array
{
    // OpenAI Files upload endpoint. This creates a file object only; vector store
    // indexing starts after the file is attached to a vector store below.
    $file = curl_file_create($path, 'text/markdown', basename($path));
    return openai_request('POST', '/files', $apiKey, [
        'multipart' => [
            'purpose' => 'assistants',
            'file' => $file,
        ],
    ]);
}

function attach_file(string $apiKey, string $storeId, string $fileId): array
{
    // Vector store file attach endpoint. This script attaches one uploaded file
    // at a time and records local state after the attach request is accepted.
    // It does not poll vector store processing status after attachment.
    return openai_request('POST', '/vector_stores/' . rawurlencode($storeId) . '/files', $apiKey, [
        'json' => [
            'file_id' => $fileId,
        ],
    ]);
}

function base_report(string $mode, array $files, int $totalBytes, int $errorCount): array
{
    $uploadCandidates = 0;
    $skipped = 0;
    $errors = [];

    foreach ($files as $file) {
        $status = $file['status'] ?? 'error';
        if ($status === 'ready' || $status === 'uploaded') {
            $uploadCandidates++;
        }
        if ($status === 'skipped') {
            $skipped++;
        }
        if ($status === 'error') {
            $errors[] = [
                'file_path' => $file['file_path'] ?? null,
                'errors' => $file['errors'] ?? ['unknown error'],
            ];
        }
    }

    return [
        'mode' => $mode,
        'checked_at' => now_utc(),
        'plan_path' => PLAN_PATH,
        'report_path' => REPORT_PATH,
        'state_path' => STATE_PATH,
        'total_files' => count($files),
        'total_bytes' => $totalBytes,
        'upload_candidates' => $uploadCandidates,
        'skipped' => $skipped,
        'errors' => $errors,
        'error_count' => $errorCount,
        'files' => $files,
    ];
}

$mode = parse_mode($argv);
repo_root_guard();

$plan = read_json_file(PLAN_PATH);
[$files, $totalBytes, $errorCount] = validate_plan_files($plan);

if ($mode === 'dry-run') {
    $report = base_report('dry-run', $files, $totalBytes, $errorCount);
    write_json_file(REPORT_PATH, $report);

    foreach ($files as $file) {
        $status = $file['status'] ?? 'error';
        $path = $file['file_path'] ?? '(unknown)';
        $bytes = $file['bytes'] ?? 0;
        fwrite(STDOUT, strtoupper((string)$status) . ': ' . $path . ' (' . $bytes . ' bytes)' . PHP_EOL);
    }
    fwrite(STDOUT, 'Wrote ' . REPORT_PATH . PHP_EOL);

    exit($errorCount === 0 ? 0 : 1);
}

$apiKey = env_required('OPENAI_API_KEY');
$storeId = env_required('WEBBLOCKS_UI_VECTOR_STORE_ID');

$state = read_state();
$bySha = state_by_sha($state);
$applyFiles = [];
$applyErrors = $errorCount;

foreach ($files as $file) {
    if (($file['status'] ?? null) !== 'ready') {
        $applyFiles[] = $file;
        continue;
    }

    $sha = (string)$file['sha256'];
    if (isset($bySha[$sha])) {
        $file['status'] = 'skipped';
        $file['reason'] = 'sha256 already present in local state';
        $file['openai_file_id'] = $bySha[$sha]['openai_file_id'] ?? null;
        $applyFiles[] = $file;
        fwrite(STDOUT, 'SKIP: ' . $file['file_path'] . PHP_EOL);
        continue;
    }

    $upload = upload_file($apiKey, (string)$file['file_path']);
    if (!$upload['ok']) {
        $file['status'] = 'error';
        $file['errors'] = ['upload failed: HTTP ' . $upload['status'] . ' ' . $upload['error']];
        $applyErrors++;
        $applyFiles[] = $file;
        fwrite(STDERR, 'ERROR upload: ' . $file['file_path'] . PHP_EOL);
        continue;
    }

    $fileId = $upload['data']['id'] ?? null;
    if (!is_string($fileId) || $fileId === '') {
        $file['status'] = 'error';
        $file['errors'] = ['upload response did not include file id'];
        $applyErrors++;
        $applyFiles[] = $file;
        fwrite(STDERR, 'ERROR upload response: ' . $file['file_path'] . PHP_EOL);
        continue;
    }

    $attach = attach_file($apiKey, $storeId, $fileId);
    if (!$attach['ok']) {
        $file['status'] = 'error';
        $file['openai_file_id'] = $fileId;
        $file['errors'] = ['attach failed: HTTP ' . $attach['status'] . ' ' . $attach['error']];
        $applyErrors++;
        $applyFiles[] = $file;
        fwrite(STDERR, 'ERROR attach: ' . $file['file_path'] . PHP_EOL);
        continue;
    }

    $uploadedAt = now_utc();
    $record = [
        'file_path' => $file['file_path'],
        'source_path' => $file['source_path'],
        'sha256' => $sha,
        'bytes' => $file['bytes'],
        'uploaded_at' => $uploadedAt,
        'openai_file_id' => $fileId,
    ];

    $state['files'][] = $record;
    $bySha[$sha] = $record;

    $file['status'] = 'uploaded';
    $file['uploaded_at'] = $uploadedAt;
    $file['openai_file_id'] = $fileId;
    $applyFiles[] = $file;
    fwrite(STDOUT, 'UPLOAD: ' . $file['file_path'] . PHP_EOL);
}

$state['updated_at'] = now_utc();
write_json_file(STATE_PATH, $state);

$report = base_report('apply', $applyFiles, $totalBytes, $applyErrors);
write_json_file(REPORT_PATH, $report);
fwrite(STDOUT, 'Wrote ' . REPORT_PATH . PHP_EOL);
fwrite(STDOUT, 'Wrote ' . STATE_PATH . PHP_EOL);

exit($applyErrors === 0 ? 0 : 1);
