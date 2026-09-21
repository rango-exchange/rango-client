/** The IndexedDB database the store opens when the host names none. */
export const DEFAULT_DB_NAME = 'rango-sdk';
/** The object store executions live in, keyed by request id. */
export const OBJECT_STORE_NAME = 'executions';
/** Bumped when the schema changes; `upgrade` in `IdbStore` handles the change. */
export const DB_VERSION = 1;
