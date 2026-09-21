# @rango-dev/sdk

Quotes, confirmation, and swap execution for Rango, usable in a browser or in
Node. The package has no dependency on React, the DOM, IndexedDB, or
BroadcastChannel; hosts that want those pass them in through the interfaces
below.

## Layout

| Folder          | What it holds                                                                  |
| --------------- | ------------------------------------------------------------------------------ |
| `client/`       | `RangoSdkClient`: quotes, confirm, and the HTTP calls the engine makes.        |
| `history/`      | `History`: the executions on record, to list, read, cancel, delete, or clear.  |
| `confirmation/` | `confirm`: re-quotes a route, validates it, and returns an execution to start. |
| `execution/`    | `SwapExecution`, the record the engine stores, plus pure readers over it.      |
| `engine/`       | The execution engine: planner, reducer, runner, actions, strategies, lock.     |
| `store/`        | The `ExecutionStore` interface, the in-memory store, and the legacy mapper.    |
| `events/`       | `EngineEvent`, what the engine tells listeners.                                |

Companion packages:

- `@rango-dev/sdk-store-idb`: an `ExecutionStore` on IndexedDB with cross-tab
  notifications, and a reader for the legacy queue-manager database.
- `@rango-dev/sdk-react`: `EngineProvider`, `useSwaps`, `useSwap`,
  `useEngineReady`.

## How the engine runs a swap

One loop per swap. Each iteration takes a snapshot of wallet state from the
host, asks the pure **planner** what to do given the stored record and that
snapshot, runs the chosen **action** under an `AbortSignal`, applies the
returned **transition** with the pure **reducer**, persists the new record, and
emits the transition as an event. The loop parks when the planner answers
_blocked_ and resumes on a wake-up: a wallet change the host reports, a wallet
lock releasing, or the engine becoming leader.

The record holds data only. Failures carry a code, a phase, and the raw detail;
blocks carry a reason and what they wait for. The host chooses every word.

What differs between chains lives in a `NamespaceStrategy`: how to find the
signing wallet, which network it must be on, whether the engine may ask the
wallet to switch, how to sign, and any prerequisites such as trustlines.

## Using it from Node

```ts
import { createClient, createEngine } from '@rango-dev/sdk';

const client = createClient({ apiKey });
const { results } = await client.quotes(request);
const confirmed = await client.confirm({
  quote: results[0],
  selectedWallets,
  settings,
});
if (!confirmed.ok) {
  throw confirmed.error; // its `cause` is a `ConfirmQuoteIssue`
}

const engine = createEngine({ client, env: myEnvironment });
engine.subscribe((event) => console.log(event.swapId, event.transition.type));
await engine.start(confirmed.execution);
```

`myEnvironment` implements `Environment`: a `snapshot` of the wallets the
engine names, `getSigner`, `canSwitchNetwork`, `switchNetwork`, a per-namespace
`namespace` accessor for chain-specific reads, and `meta.blockchain` for chain
ids and explorer links. The default store is in memory; pass any
`ExecutionStore` to persist.

## Confirming a quote

`confirm` takes the quote the user picked, one wallet per chain, and an
optional custom destination. Before calling the API it checks that every chain
the route touches has a wallet; with a custom destination the chain the route
ends on only receives, so it needs none. A call that fails is tried once more
after two seconds, unless the host aborted it through `RequestOptions.signal`.

A result that is not `ok` carries a `RangoSdkError` whose `cause` is a
`ConfirmQuoteIssue`: `request_canceled`, `request_failed`, `missing_wallets`,
`no_result`, `amount_out_of_range`, or `insufficient_slippage`. It holds data
only; the host words it.

A result that is `ok` carries the confirmed route, the execution to start, and
`warnings`. Every warning is checked on its own, so more than one can be set,
and none of them stops the swap:

| Key                    | Set when                                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| `highValueLoss`        | The output is worth 10% less than a $400 input, or 5% less than a $1000 one.                   |
| `outputChange`         | The confirmed output is worth 1% less than the picked quote's on a $1000 input, or 2% on $500. |
| `unknownPrice`         | The input or the output token has no USD price, so value loss cannot be judged.                |
| `insufficientSlippage` | The user's slippage is below what a step recommends.                                           |
| `highSlippage`         | The user's slippage is above 5%.                                                               |
| `balance`              | A selected wallet is short of an asset the route needs. The execution then skips that check.   |

The thresholds are the widget's, so a host that moves to the SDK keeps seeing
the same warnings. The fee total in `highValueLoss` prices each fee from the
tokens in the meta the host lends through `getMeta`, as the widget does, and
from the API's fee price when that meta carries no tokens.

## Using it from a browser

```ts
import { createClient, createEngine, createMemoryStore } from '@rango-dev/sdk';
import {
  createIndexedDbStore,
  migrateLegacyQueues,
} from '@rango-dev/sdk-store-idb';

const store = await createIndexedDbStore({ apiKey }).catch(() =>
  createMemoryStore()
);
await migrateLegacyQueues(store);

const engine = createEngine({ client, env, store, leader: false });
engine.setLeader(isActiveTab); // only one tab runs loops
walletEvents.on('change', (walletType) =>
  engine.notifyWalletsChanged(walletType)
);
```

## History and events

The client keeps every execution it ran, or found in `config.store`, and
exposes them as `client.history`:

| Method              | What it does                                                             |
| ------------------- | ------------------------------------------------------------------------ |
| `getAll()`          | Every execution on record, newest first.                                 |
| `get(requestId)`    | One execution; throws when there is none.                                |
| `cancel(requestId)` | Stops a running execution; see below.                                    |
| `delete(requestId)` | Removes a finished execution. A running one is refused: cancel it first. |
| `clear()`           | Removes every finished execution and leaves the running ones.            |

`client.subscribe(listener)` delivers every change in one stream and returns
the function that unsubscribes: `{ type: 'transition', requestId, transition,
execution }` for each committed transition, with the record after it, and
`{ type: 'deleted', requestId }` for each removal. Events fire in the process
that made the change; another tab sharing the store hears nothing. A listener
that throws is reported on the console and skipped, so a bug in a host's
rendering cannot stop a swap.

```ts
const unsubscribe = client.subscribe((event) => {
  if (event.type === 'deleted') {
    remove(event.requestId);
  } else {
    upsert(event.execution);
  }
});
```

Cancelling fails the record at once with `USER_CANCEL` in the `cancel` phase,
on the step that was running or would have run next, and rejects the caller
waiting on `execute`. Whatever the action in flight comes back with afterwards
is dropped, and a prompt the wallet was about to open stays closed. A prompt
that is already open cannot be withdrawn: a transaction the user still signs
is sent, but never recorded, and the steps after it do not run.

## Pausing and resuming

A host with several tabs on one store must let only one of them run swaps.
`client.pause()` puts the engine in read-only mode: no loop starts, `execute`
throws, wallet events are ignored, and a loop that is running stops once the
action in flight has returned and its result is on record. History, cancel,
delete and subscribe keep working. `client.resume()` lets the engine run again
and continues every execution still on record, which is also how a host
resumes after a reload: call it on the active tab once wallets have
reconnected, and again whenever the tab becomes active. Calling it while a
loop is already running is harmless. `client.isPaused` says which mode the
client is in; it starts out running.

Two limits, both matching the queue manager today: a prompt open in a paused
tab stays open, and the tab that resumes fails that step with `TX_EXPIRED`
since it cannot tell whether the user signed; and a paused tab hears no events
for what the active tab does, so a live list there has to read `history`
again.

## Behaviour worth knowing

- A transaction handed to the wallet before a reload is never offered again.
  The step fails with `TX_EXPIRED`, because the wallet may already have sent it.
- One swap signs with a given wallet type at a time. Others wait with
  `waiting_for_another_swap` and resume in creation order.
- Tracking polls every 5 s. Request failures back off from 5 s to 60 s and the
  swap fails after 30 in a row.
- Writes are versioned. A store rejects a write that does not carry the version
  it holds, so two tabs never overwrite each other.

## Tests

```
yarn vitest run sdk/sdk/tests
```

The planner is table-tested, the reducer is replay-tested, and the engine runs
end-to-end scenarios against a scripted fake environment and client. `confirm`
runs against a fake HTTP client, and its warnings and checks are table-tested.
