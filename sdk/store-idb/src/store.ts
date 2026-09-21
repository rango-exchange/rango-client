import type { Store, SwapExecution } from '@rango-dev/sdk';
import type { DBSchema, IDBPDatabase } from 'idb';

import { RangoSdkError } from '@rango-dev/sdk';
import { openDB } from 'idb';

import { DB_VERSION, DEFAULT_DB_NAME, OBJECT_STORE_NAME } from './constants';

interface Database extends DBSchema {
  [OBJECT_STORE_NAME]: {
    key: string;
    value: SwapExecution;
  };
}

export type IdbStoreOptions = {
  /** The database to open. Two stores on the same name share their executions. */
  dbName?: string;
};

/**
 * A `Store` on IndexedDB, so executions survive a reload and are visible to
 * every tab of the same origin. The version rule is enforced inside one
 * read-write transaction: IndexedDB runs such transactions on the same store
 * one at a time, so two tabs cannot both pass the check and overwrite each
 * other.
 *
 * The database is opened on the first call, not in the constructor, so
 * creating the store never throws and a failed open is retried by the next
 * call.
 */
export class IdbStore implements Store {
  #dbName: string;
  #db: Promise<IDBPDatabase<Database>> | null = null;

  constructor(options: IdbStoreOptions = {}) {
    this.#dbName = options.dbName ?? DEFAULT_DB_NAME;
  }

  async insert(exec: SwapExecution) {
    const db = await this.#open();
    const tx = db.transaction(OBJECT_STORE_NAME, 'readwrite');
    const current = await tx.store.get(exec.requestId);

    if (current) {
      // Nothing was written, so the transaction commits empty when it ends.
      throw new RangoSdkError(
        `execution with id ${exec.requestId} already exists`
      );
    }

    await Promise.all([tx.store.add(exec), tx.done]);
  }

  async update(exec: SwapExecution) {
    const db = await this.#open();
    const tx = db.transaction(OBJECT_STORE_NAME, 'readwrite');
    const current = await tx.store.get(exec.requestId);

    if (!current) {
      throw new RangoSdkError(`execution with id ${exec.requestId} not found`);
    }
    if (exec.version !== current.version + 1) {
      throw new RangoSdkError(
        `execution ${exec.requestId} is at version ${current.version}; refusing to write version ${exec.version}`
      );
    }

    await Promise.all([tx.store.put(exec), tx.done]);
  }

  async delete(id: string) {
    const db = await this.#open();
    await db.delete(OBJECT_STORE_NAME, id);
  }

  async get(id: string) {
    const db = await this.#open();
    const exec = await db.get(OBJECT_STORE_NAME, id);
    if (!exec) {
      throw new RangoSdkError(`execution with id ${id} not found`);
    }
    return exec;
  }

  async getAll() {
    const db = await this.#open();
    return db.getAll(OBJECT_STORE_NAME);
  }

  /** Opens the database once and shares it; forgets a failed open so the next call tries again. */
  async #open(): Promise<IDBPDatabase<Database>> {
    if (!this.#db) {
      this.#db = openDB<Database>(this.#dbName, DB_VERSION, {
        upgrade(db) {
          db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'requestId' });
        },
      }).catch((error: unknown) => {
        this.#db = null;
        throw new RangoSdkError(
          `Couldn't open IndexedDB database ${this.#dbName}`,
          error
        );
      });
    }
    return this.#db;
  }
}
