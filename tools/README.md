# AI Knowledge Export Tools

These tools prepare a public-safe, repeatable WebBlocks UI knowledge export for RAG/vector-store readiness. This phase still does not create an OpenAI vector store, call the OpenAI API, upload files, create assistants, or store private endpoint configuration.

The generated output is a build artifact written to `build/ai-knowledge/`. That directory is intentionally ignored by git.

## Usage

Run from the repository root:

```sh
./tools/export-ai-knowledge.sh
./tools/validate-ai-knowledge.sh
```

## Output

The export script creates:

- `build/ai-knowledge/manifest.json`
- `build/ai-knowledge/vector-store-sync-plan.json`
- `build/ai-knowledge/advisor-system-prompt.md`
- `build/ai-knowledge/webblocks-ui-knowledge.md`
- `build/ai-knowledge/webblocks-ui-rules.md`
- `build/ai-knowledge/webblocks-ui-examples.md`
- `build/ai-knowledge/chunks/*.md`

## Artifact Roles

`manifest.json` is the canonical generated manifest. It lists every chunk with repo-relative source path, source group, title, content type, source priority, SHA-256 hash, and byte size.

`advisor-system-prompt.md` is a compact WebBlocks UI Advisor system prompt generated from the repository rules. It tells a future advisor to use shipped WebBlocks UI patterns, surfaces, primitives, and hooks instead of inventing a parallel UI system.

`vector-store-sync-plan.json` is a dry-run upload plan for a future vector-store phase. It lists the chunk and advisor files with metadata, hashes, and sizes, but it does not upload anything or reference any live vector store.

`chunks/*.md` are source-based markdown chunks. Each chunk starts with front matter containing `source_path`, `source_group`, `content_type`, `priority`, and `generated_at`.

## Public Repository Safety Rules

Generated knowledge exports must stay public-safe:

- Do not include local absolute paths.
- Do not include API keys, tokens, or private credentials.
- Do not include assistant IDs, vector store IDs, or private endpoint values.
- Use repo-relative source paths in manifests, chunks, and sync plans.
