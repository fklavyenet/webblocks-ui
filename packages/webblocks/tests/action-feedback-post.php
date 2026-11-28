<?php
// Synthetic local fixture only. Return whitelisted test fields, never request headers.
header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: no-store');
$result = [
    'fixture' => 'action-feedback',
    'title' => $_POST['title'] ?? null,
    'intent' => $_POST['intent'] ?? null,
    'method' => $_POST['_method'] ?? null,
    'excluded' => array_key_exists('excluded', $_POST),
    'file' => isset($_FILES['artifact']) ? basename($_FILES['artifact']['name']) : null,
    'size' => $_FILES['artifact']['size'] ?? null,
];
?>
<!doctype html><title>Synthetic action payload</title><script>
parent.postMessage(<?= json_encode($result, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?>, location.origin);
</script>
