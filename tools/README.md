# AI Knowledge Export Tools

This phase prepares a public-safe, repeatable AI knowledge export package from the WebBlocks UI repository sources. It does not create an OpenAI vector store, call the OpenAI API, upload files, or store any vector store configuration.

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
- `build/ai-knowledge/webblocks-ui-knowledge.md`
- `build/ai-knowledge/webblocks-ui-rules.md`
- `build/ai-knowledge/webblocks-ui-examples.md`
- `build/ai-knowledge/chunks/*.md`

## Public Repository Safety Rules

Generated knowledge exports must stay public-safe:

- Do not include local absolute paths.
- Do not include API keys, tokens, or private credentials.
- Do not include vector store IDs or private endpoint values.
- Use repo-relative source paths in manifests and chunks.
