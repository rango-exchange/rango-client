import type { Engine } from '../execution/engine';
import type { Store } from '../execution/store';
import type { SwapExecution } from '../execution/types';

import { RangoSdkError } from '../errors';
import { notifyListeners } from '../listeners';

/** What listeners get when an execution leaves the store. */
export type HistoryEvent = { type: 'deleted'; requestId: string };

export type HistoryListener = (event: HistoryEvent) => void;

/**
 * The executions on record, for a host's history and swap details screens:
 * list and read them, stop a running one, remove finished ones. Reads go to
 * the store. A removal that would pull a record out from under its loop is
 * refused, and stopping a loop goes through the engine, so the store is
 * never touched behind the engine's back.
 */
export class History {
  #store: Store;
  #engine: Engine;
  #listeners = new Set<HistoryListener>();

  constructor(params: { store: Store; engine: Engine }) {
    this.#store = params.store;
    this.#engine = params.engine;
  }

  /** Every execution on record, newest first. */
  async getAll(): Promise<SwapExecution[]> {
    const executions = await this.#store.getAll();
    return [...executions].sort((a, b) => b.createdAt - a.createdAt);
  }

  /** One execution by request id. Throws when there is none. */
  async get(requestId: string): Promise<SwapExecution> {
    return this.#store.get(requestId);
  }

  /** Stops a running execution; see `Engine.cancel` for what that entails. */
  async cancel(requestId: string): Promise<void> {
    await this.#engine.cancel(requestId);
  }

  /**
   * Removes a finished execution. A running one is refused, because its loop
   * would find its record gone: cancel it first. Throws when there is none.
   */
  async delete(requestId: string): Promise<void> {
    const exec = await this.#store.get(requestId);
    if (exec.status === 'running') {
      throw new RangoSdkError(
        `execution ${requestId} is running; cancel it before deleting it`
      );
    }
    await this.#remove(requestId);
  }

  /** Removes every finished execution and leaves the running ones alone. */
  async clear(): Promise<void> {
    const executions = await this.#store.getAll();
    for (const exec of executions) {
      if (exec.status !== 'running') {
        await this.#remove(exec.requestId);
      }
    }
  }

  /** Registers a listener for every removal and returns what removes it. */
  subscribe(listener: HistoryListener): () => void {
    this.#listeners.add(listener);
    return () => {
      this.#listeners.delete(listener);
    };
  }

  async #remove(requestId: string): Promise<void> {
    await this.#store.delete(requestId);
    notifyListeners(this.#listeners, { type: 'deleted', requestId });
  }
}
