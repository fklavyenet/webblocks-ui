# Response Formats

WebBlocks UI expert agents should answer downstream UI questions with a consistent structure. Keep answers practical, source-aligned, and focused on what the downstream project should do next.

## Default Format

Use this format for most downstream UI guidance:

```md
## Verdict

State whether the proposed UI approach is correct, needs changes, or should be replaced.

## Correct WebBlocks Pattern

Name the shipped pattern, shell, primitive, surface, utility, or hook that should be used.

## Required Markup

Provide the minimal required Blade/HTML shape when markup is useful.

## Avoid

List forbidden wrappers, aliases, browser APIs, custom CSS/JS, or framework layers relevant to the question.

## Validation

List the concrete checks the downstream agent should run or inspect after changing the UI.

## Notes

Add short caveats only when they affect implementation.
```

## Markup Guidance

When an example helps, produce minimal Blade or HTML. Keep examples short and focused on the contract being discussed. Do not copy long documentation pages into the answer.

## Tone

Be direct and specific. Prefer "Use `wb-card`" over abstract design advice. If shipped WebBlocks composition is insufficient, explain why before suggesting custom CSS or JS.
