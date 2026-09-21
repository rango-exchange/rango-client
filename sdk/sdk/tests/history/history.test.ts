import type { SwapExecution } from '../../src/execution/types';
import type { HistoryEvent } from '../../src/history/history';
import type { RangoClient } from 'rango-sdk';

import { describe, expect, it, vi } from 'vitest';

import { RangoSdkError } from '../../src/errors';
import { Engine } from '../../src/execution/engine';
import { MemoryStore } from '../../src/execution/store';
import { History } from '../../src/history/history';
import { execution, META } from '../execution/fakes';

/** A record with the given id and status; `createdAt` orders the listing. */
function record(
  requestId: string,
  status: SwapExecution['status'],
  createdAt = 0
): SwapExecution {
  return { ...execution(null), requestId, status, createdAt };
}

/** When each record of the ordering test was created. */
const CREATED_AT = { old: 1, mid: 2, new: 3 };

async function setup(...records: SwapExecution[]) {
  const store = new MemoryStore();
  for (const exec of records) {
    await store.insert(exec);
  }
  const engine = new Engine({
    httpClient: {} as RangoClient,
    store,
    getProvider: () => undefined,
    getMeta: () => META,
  });
  const history = new History({ store, engine });
  const events: HistoryEvent[] = [];
  history.subscribe((event) => events.push(event));
  return { store, history, events };
}

describe('History', () => {
  it('lists executions newest first', async () => {
    const { history } = await setup(
      record('old', 'success', CREATED_AT.old),
      record('new', 'failed', CREATED_AT.new),
      record('mid', 'running', CREATED_AT.mid)
    );

    const ids = (await history.getAll()).map((exec) => exec.requestId);

    expect(ids).toEqual(['new', 'mid', 'old']);
  });

  it('reads one by request id and throws for one it does not hold', async () => {
    const { history } = await setup(record('req-1', 'success'));

    expect((await history.get('req-1')).requestId).toBe('req-1');
    await expect(history.get('missing')).rejects.toThrow(RangoSdkError);
  });

  it('deletes a finished execution and tells listeners', async () => {
    const { store, history, events } = await setup(
      record('done', 'success'),
      record('kept', 'failed')
    );

    await history.delete('done');

    expect((await store.getAll()).map((exec) => exec.requestId)).toEqual([
      'kept',
    ]);
    expect(events).toEqual([{ type: 'deleted', requestId: 'done' }]);
  });

  it('refuses to delete a running execution', async () => {
    const { store, history, events } = await setup(record('live', 'running'));

    await expect(history.delete('live')).rejects.toThrow(RangoSdkError);

    expect(await store.getAll()).toHaveLength(1);
    expect(events).toEqual([]);
  });

  it('clears finished executions and leaves running ones', async () => {
    const { store, history, events } = await setup(
      record('done', 'success'),
      record('live', 'running'),
      record('broken', 'failed')
    );

    await history.clear();

    expect((await store.getAll()).map((exec) => exec.requestId)).toEqual([
      'live',
    ]);
    expect(events.map((event) => event.requestId)).toEqual(['done', 'broken']);
  });

  it('cancels a running execution through the engine', async () => {
    const { store, history } = await setup(record('live', 'running'));

    await history.cancel('live');

    expect(await store.get('live')).toMatchObject({
      status: 'failed',
      failure: { code: 'USER_CANCEL', phase: 'cancel' },
    });
  });

  it('stops telling a listener after it unsubscribes', async () => {
    const { history } = await setup(record('done', 'success'));
    const listener = vi.fn();
    const unsubscribe = history.subscribe(listener);
    unsubscribe();

    await history.delete('done');

    expect(listener).not.toHaveBeenCalled();
  });
});
