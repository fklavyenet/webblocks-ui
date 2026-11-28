# WebBlocks Action Feedback

WebBlocks Action Feedback is the shared standard for work-in-progress feedback
and repeat activation protection on product-owned admin, auth, account and
interactive screens. The shipped `WBActionFeedback` runtime owns the request
registry, transient indicator markup, restoration and interaction guards.
Hosts own translated labels, confirmation, authorization, transport, durable
job state and persistent results. Do not copy this runtime or a feedback Blade
template into each product. No framework, plugin or additional runtime is needed.

## Native forms

Opt in an owning form or product shell. Attribute presence enables same-window
POST forms, including method-spoofed mutations. Localize the label at the shell,
form or invoked control. The nearest label wins. A product package opts in its
own layouts; it must not change unrelated host pages.

```html
<main data-wb-action-feedback data-wb-action-label="Processing…">
  <form id="profile" method="post" action="/profile"
        data-wb-action-label="Saving…">
    <!-- CSRF, method override and fields belong to the host. -->
    <label for="profile-name">Name</label>
    <input class="wb-input" id="profile-name" name="name" required>
  </form>
  <button class="wb-btn wb-btn-primary" type="submit" form="profile"
          name="intent" value="save">Save</button>
</main>
```

Feedback starts on the accepted submit event, after native constraint validation
and form/document confirmation or feature handlers. A canceled/intercepted
submission acquires no native-navigation lock. A later window cancellation also
restores any transient state. Repeated submit events and activation of pending
submit controls are guarded before feature handlers can run again.

Inputs, files, selected submitter name/value, method/target overrides and original
disabled states remain intact. The guard uses `aria-disabled` and events, never
disables successful controls before serialization. Input submitter values are
never replaced with a busy label. External `form` controls and injected forms
work without per-form listeners. Enter/implicit submission shares the same lock.

`data-wb-action-feedback="off"` on a form/owning scope excludes native automatic
handling. GET filters, different-target forms, downloads and ordinary navigation
keep their behavior. A submitted POST overrides a form's method in the normal
native way. Attribute opt-in does not rewrite requests or add confirmations.

## Indicators and modal protection

Only the invoked action shows a spinner and processing label. Icon actions retain
their dimensions and accessible names. A live status is connected outside the
busy surface while staying inside any active native dialog. Ordinary button work
uses a screen-reader status; input submitters get an adjacent visible spinner
without changing their submitted value. Row/menu work stays compact.

Within a modal/drawer the default is localized status plus an indeterminate
native `progress.wb-progress-bar`. For other long requests set
`data-wb-action-progress="true"`. Unknown work has no `value` and no invented
percentage. Host-owned detailed progress is never replaced or relocated.

Pending work guards user overlay dismissal through `wb:overlay:close-request`,
covering Escape, backdrop, close and dismiss controls. Mark a nonstandard cancel
link/control `data-wb-action-dismiss` to join the same guard. Programmatic overlay
close remains owned by the overlay API. A genuinely cancellable operation may
use `lockClose: false` and keep its domain cancel handler. No competing focus
trap, overlay stack or browser confirm/alert is introduced.

## Asynchronous and queued work

```js
var finish = WBActionFeedback.begin(form, button, {
  label: translatedSavingLabel,
  progress: true,
  native: false
});
if (!finish) return; // Another operation already owns this form/modal.
try {
  // Dispatch once; host validates the response and renders its real outcome.
} finally {
  finish(); // Release after this request ends. Safe to call more than once.
}
```

Public API:

- `begin(surface, button, options)` returns an idempotent cleanup callback, or
  `null` when invalid/disabled/pending. Call it before dispatching side effects.
  `surface` is a connected Element, usually the owning form or work panel;
  `button` may be null for a programmatic operation.
- `isPending(element)` checks an owning surface, control, associated form or
  locked modal/drawer. Check before preparing side effects where necessary.
- `configure({label: translatedProcessingLabel})` sets a fallback label. Explicit
  API/attribute labels win. Configuration alone does not opt in every form.
- `bind(root)` retains dynamic-binding compatibility. Delegation already covers
  newly injected forms and controls.

`begin` options: `label`, `native` (default false), `progress` (default true in
overlays), `inline` (true shows ordinary status), `feedback` (false adds no status
or progress markup), `feedbackTarget` (connected Element in the same overlay),
and `lockClose` (default true). A cleanup callback reports no success by itself.

For queued/durable jobs, HTTP acceptance does not mean completion. Keep existing
polling and recovery. Choose the request or job lifetime deliberately; release a
job lock only at a known terminal outcome. A disconnected/unknown operation is
not a completed operation. Do not unlock by timer, invent progress, retry a
mutation automatically, or replace server concurrency/idempotency controls.
`pageshow.persisted` restores native-navigation locks only; active asynchronous
work is not released by browser navigation restoration.

## Check for updates and install updates

Both are in scope. For a same-window GET check link, explicitly add
`data-wb-action-link` and a localized label. This hook handles only same-origin
HTTP(S) links; modifier clicks, downloads, hash links and alternate targets retain
native behavior. It does not opt in other links or GET filter forms.

```html
<a class="wb-btn wb-btn-secondary" href="/system/updates/check"
   data-wb-action-link data-wb-action-label="Checking for updates…">Check for updates</a>
```

A POST check uses normal form opt-in. The host renders the result persistently
in an inline `wb-alert` near the update controls after POST/redirect. Distinguish
an available update, an up-to-date/newer installation, no release, incompatibility
and failure. A failed/unavailable check never reports up-to-date. Background
indicator/progress polling must not consume a pending result; passive polling
creates no result messages.

The existing detailed install modal is required to retain stages, elapsed time,
logs/details, success/failure and recovery. Publisher Client continues to own
that operation. Mark its form `data-wb-action-feedback="off"`; intercepted update
handlers then use `begin(..., {feedback: false, native: false})` only where needed
for the shared interaction guard, and finish at the real lifecycle boundary.
Do not add a second progress bar, change update transport/activation, duplicate
locking, or reduce the install modal to a busy button. The host must not finish
an update lock merely because the initial HTTP request was accepted.

## Compatibility and migration

Existing `data-wb-busy`, `data-wb-busy-label`, `data-wb-busy-text` and
`WBBusySubmit.bind()` remain supported through the same request registry. There
is no second automatic binder. A busy text span is restored with its original
nodes when feedback ends. The submitter now remains a successful control, and
canceled/back-navigation states restore rather than remaining disabled. Do not
use the old `disabled` side effect as application state; query `isPending`.

Migration order: inventory product-owned native/asynchronous/queued/update flows;
read the pinned contract and the target release's contract; adopt a real released
UI pin with matching assets; configure localized labels and exclusions in owning
layouts; replace product feedback registries/templates with the shared API;
keep domain confirmation and status/recovery adapters; verify and document any
remaining specialized lifetime. Never edit vendor/generated runtime copies.

## Acceptance

Check source and dist: invalid/canceled submissions, late cancellation, double
click/Enter, payloads including file and submitter, external controls, injected
forms, disabled states, icon size, native/legacy modal dismissal, live status
placement, cleanup after success/failure, native Back restoration, GET/target
exclusions, explicit GET checks, and retained install details/time/recovery.
Test concurrent independent surfaces and overlap rejection. Preserve all locales,
keyboard behavior, light/dark modes and reduced motion. The dependency-free
browser fixture is `packages/webblocks/tests/action-feedback.html`; its synthetic
payload endpoint is `action-feedback-post.php`. Open it in the operator's
existing browser session; it does not launch a browser or call product services.
