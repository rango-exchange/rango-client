# @rango-dev/sdk-store-idb

A `Store` for `@rango-dev/sdk` on IndexedDB, so executions survive a reload
and are visible to every tab of the same origin. Hand it to the client and the
engine keeps its records there instead of in memory.

```ts
import { createClient } from '@rango-dev/sdk';
import { IdbStore } from '@rango-dev/sdk-store-idb';

const client = createClient({
  apiKey,
  getProvider,
  getMeta,
  store: new IdbStore(),
});
```

`IdbStore` takes an optional `dbName`; it opens `rango-sdk` when none is
given. Two stores on the same name share their executions, which is how a tab
that reloads finds what it was running.

## Behaviour worth knowing

- The database is opened on the first call, not in the constructor, so
  creating the store never throws. A failed open rejects that call with a
  `RangoSdkError` and is tried again by the next one.
- Writes are versioned, as the `Store` contract asks: `update` is refused
  unless the record's `version` is exactly one above the stored one. The check
  and the write share one read-write transaction, and IndexedDB runs such
  transactions on the same store one at a time, so two tabs cannot both pass
  the check and overwrite each other.
- `insert` refuses a request id it already holds; `get` and `update` throw for
  one it does not; `delete` of an unknown id is a no-op. The in-memory store
  behaves the same, so a host can swap one for the other.

## Tests

```
yarn vitest run sdk/store-idb/tests
```

The suite runs against `fake-indexeddb`, with a fresh database per test.
