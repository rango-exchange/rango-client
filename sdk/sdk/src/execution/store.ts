import type { SwapExecution } from './types';

import { RangoSdkError } from '../errors';

/**
 * Where executions live between turns of the loop and across reloads. Writes
 * are versioned: `update` takes the whole record and is refused unless its
 * `version` is exactly one above the stored one, so two writers cannot
 * silently overwrite each other.
 */
export type Store = {
  insert: (exec: SwapExecution) => Promise<void>;
  update: (exec: SwapExecution) => Promise<void>;
  delete: (id: string) => Promise<void>;
  get: (id: string) => Promise<SwapExecution>;
  getAll: () => Promise<SwapExecution[]>;
};

export class MemoryStore implements Store {
  private items: Map<string, SwapExecution>;
  constructor() {
    this.items = new Map();
  }

  async insert(exec: SwapExecution) {
    if (this.items.has(exec.requestId)) {
      throw new RangoSdkError(
        `execution with id ${exec.requestId} already exists`
      );
    }
    this.items.set(exec.requestId, exec);
  }

  async update(exec: SwapExecution) {
    const current = this.items.get(exec.requestId);

    if (!current) {
      throw new RangoSdkError(`execution with id ${exec.requestId} not found`);
    }
    if (exec.version !== current.version + 1) {
      throw new RangoSdkError(
        `execution ${exec.requestId} is at version ${current.version}; refusing to write version ${exec.version}`
      );
    }

    this.items.set(exec.requestId, exec);
  }

  async delete(id: string) {
    this.items.delete(id);
  }

  async get(id: string) {
    const exec = this.items.get(id);
    if (!exec) {
      throw new RangoSdkError(`execution with id ${id} not found`);
    }
    return exec;
  }

  async getAll() {
    return Array.from(this.items.values());
  }
}
