# New SDK Components

## Client

Construction:

- createClient(config: RangoSdkConfig): RangoSdkClient // process-wide singleton
- getClient(): RangoSdkClient // throws if not created

Scope:

- httpClient
- engine
- history

Config:

```
interface RangoSdkConfig {
  apiKey: string;
  baseUrl?: string;
  getProvider: (type: string) => Provider<DefaultNamespaces> | undefined;
  getMeta: () => { blockchains: BlockchainMeta[]; tokens?: Token[] };
  store?: Store;   // MemoryStore when omitted
}
```

Actions:

- quote: (params) => Promise<BestRouteResponse with ExecutableObject & validation>
- quotes: (params) => Promise<MultiRouteResponse>
- confirm: (params) => Promise<ConfirmQuoteResult with ExecutableObject & validation>
- execute: (ExecutableObject) => Promise<Result> promise stores in engine promise registry and resolves at the end

Helpers:

- notify: (event: WalletEvent) => notify engine to wake up blocked executions (if not paused)
- resume/pause: call resume/pause from engine
- subscribe: subscribe to engine commits

## Engine

Scope:

- isPaused
- PromiseRegistry
- httpClient
- store
- context: getProvider, getMeta

Components:

- Decider: checks the current state of the execution, returns Decision object ({ kind: 'no_action' }, { kind: 'succeed' }, { kind: 'run_action'; stepIndex: number; action: Action }, e.g.)
- ActionRunner: Runs an action based on the decision ({ type: 'create_transaction' }, { type: 'run_prerequisite'; prerequisiteIndex: number }, e.g.), returns a Transition ({ type: 'started' }, { type: 'step_started'; stepIndex: number }, { type: 'tx_built'; stepIndex: number; tx: Transaction }, e.g.)
- Committer: receives a transition, applies transitions side effects (apply transition to store, call listeners, resolve or reject promise from promise registry if needed)

Helpers:

- turn: based on the engine status (paused value) calls decider and action runner for a running execution

Interface:

- execute: add a promise bound to an execution which will be resolved or rejected at the last commit, add execution object to store,
- resume: assigns paused as false and continues all running executions
- pause: assigns paused as true, engine gets readonly and so `execute` returns error
- subscribe: subscribe to any transition
- notify: find all executions which are blocked for the received event and continues them

## History

Interface:

- getAll: () => return all execution records
- get: (requestId): => return execution record
- cancel: (requestId): =. cancel running execution on engine
- clear () => void
- delete: () => void
- subscribe: () => subscribe to items
