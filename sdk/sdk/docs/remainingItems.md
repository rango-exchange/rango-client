# What still stands between the SDK and the widget

Status as of 2026-09-16, on `feat/evm-approval-prerequisites`.

The engine runs a swap end to end when the wallet is connected and on the right
chain: confirm, build, prerequisites (EVM and Tron approvals through the wallet's
`getAllowance`, XRPL and Stellar trust lines), guarded signing with automatic
network switch, status polling, next step. Hyperliquid actions are signed as
typed data on the chain the action names, submitted to the exchange, and their
hash looked up on the explorer before tracking. A step whose wallet is not
ready parks with a `blocked` transition and resumes through `notify`. What
follows is what is missing, in two groups: what the SDK cannot do yet, and what
the widget has to build before it can switch over.

## SDK gaps that block a real run

1. **Nothing survives a reload yet.** `IdbStore` in `@rango-dev/sdk-store-idb`
   (`sdk/store-idb`) persists executions, the client takes it through
   `config.store`, and `client.resume` runs what it holds, but the widget does
   not call it yet. Existing users have queues in the legacy queue-manager
   database, so a migration of those is still needed. The single-tab rule is
   the host's: `pause` on an inactive tab, `resume` on the active one, driven
   by the widget's tab manager as `isPaused` is today. Two multi-tab gaps
   remain: a prompt open in a paused tab is expired by the tab that resumes
   (as the preset does today), and a paused tab gets no events for what the
   active tab does, since the store does not broadcast its writes.

2. **Resume is not yet wired.** The sign-expiry guard is in the decider: a
   step with `signRequestedAt` set, no hash, and no submission fails with
   `TX_EXPIRED` instead of being offered to the wallet again. The decider only
   runs between actions, so such a step can only mean an abandoned prompt,
   after a reload or a throw. Prerequisites need no guard: approve and trust
   lines check chain state before they prompt, so a re-run after a reload
   skips, or at worst repeats a harmless approval. Still to do: the widget
   calling `client.resume` on the active tab once auto-connect has settled.

3. **Cancel cannot abort an action in flight.** `history.cancel` fails the
   record with `USER_CANCEL` in the `cancel` phase, drops whatever the running
   action returns afterwards, and keeps a wallet prompt from opening when the
   cancel lands before it. It cannot withdraw a prompt that is already open,
   and an action waiting on a poll interval or a pending request runs to its
   end before the loop notices: actions take no `AbortSignal` yet. Same
   behaviour as the preset's `cancelSwap`, so not blocking.

4. **Two swaps on one wallet prompt at once.** The `waiting_for_another_swap`
   block is typed in `src/execution/types.ts` but never produced. The queue
   manager serialises wallet prompts with a claim lock; the SDK has no
   counterpart.

5. **Smaller parity losses.**
   - Failures are not reported to the API. The preset calls `reportFailure`
     for every failed step; `SwapFailure.origin` documents the intent.
   - No replaced, cancelled, or reverted transaction detection through
     `signer.wait`. The `tx_replaced` and `tx_submitted` transitions exist in
     the reducer and nothing emits them.
   - Explorer links on send are always `null`. Meta is available now, so the
     chain's `transactionUrl` can fill it.
   - The retry policy is a flat five seconds forever for any thrown error, with
     no backoff and no cap.
   - `setConfig` keeps the first HTTP client when the API key changes.

## Widget-side work before it can switch

1. **The record shape.** Thirty-two widget files import `PendingSwap` or the
   queue manager. Swap details, history, notifications, retry-quote, and the
   per-step messages read fields the SDK record does not have. Either a mapper
   from `SwapExecution` to what those screens read, or the screens rewritten
   against the SDK record and its `route`.

2. **The public events contract.** Integrators subscribe to the widget's route
   and step events (`widget/embedded/src/types/event.ts`), which carry a
   message and a severity written by the preset's notifier. The SDK emits
   data-only transitions by design, so the widget has to build that layer:
   transition plus record in, worded route and step events out. This is the
   largest single piece.

3. **Start and wallet wiring.** Replace `manager.create` on the confirm page
   with `client.execute`; call `client.notify` from the two handlers in
   `widget/embedded/src/hooks/useBootstrap/useBootstrap.ts` (the connect
   handler maps to `wallet_connected` for a new wallet type and to
   `wallet_accounts_changed` or `wallet_network_changed` when the event carries
   those fields; the disconnect handler maps to `wallet_disconnected`); call
   `client.resume` once auto-connect has settled, and switch `client.pause`
   and `client.resume` on `isActiveTab` where the queue-manager provider gets
   `isPaused` today (`widget/embedded/src/QueueManager.tsx`). On the swap
   details page, replace the preset's `cancelSwap` with `client.history.cancel`
   and `manager.deleteQueue` with `client.history.delete`; the history page
   reads `client.history.getAll()` and re-renders on `client.subscribe`. Small.

4. **Provider and meta.** `getProvider` maps to `hubProvider` from the wallets
   context and `getMeta` to the app store's blockchains and tokens. Already
   available, nothing to build.

## Not blocking

- **Quote fetching** can stay in the widget. The SDK's `quote` and `quotes`
  are passthroughs to `rango-sdk` and carry none of the widget's request
  shaping, sorting, default-quote selection, error typing, or warnings.
- **Confirmation** covers the confirm call, route validation, balance
  shortfalls, and building the record. Quote-change warnings are being added
  in parallel. Still absent: the wallet coverage check (every chain the route
  touches has a selected wallet), custom destination validation, and the
  single retry on a failed confirm call.
- **The readme** describes `createEngine`, `Environment`, `NamespaceStrategy`,
  leader mode, a backoff-and-give-up retry policy, and two companion packages
  that do not exist, and does not mention `getProvider`, `getMeta`, or
  `notify`, which every host has to supply.

## Suggested order

1. Legacy queue migration, and the widget wiring `pause` and `resume` to its
   tab manager.
2. The widget's event and record adapters, then the start and wallet wiring.
3. The per-wallet lock, an `AbortSignal` for actions so cancel stops them at
   once, store change broadcasting for paused tabs, and the parity items, once
   a swap survives a reload end to end.
