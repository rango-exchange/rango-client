import type { ConfirmedRoute, SwapExecution } from '@rango-dev/sdk';

import { createExecution, RangoSdkError } from '@rango-dev/sdk';
import { IDBFactory } from 'fake-indexeddb';
import { beforeEach, describe, expect, it } from 'vitest';

import { IdbStore } from '../src/store';

import 'fake-indexeddb/auto';

/** Only the fields `createExecution` reads; the cast covers the rest. */
function execution(requestId = 'req-1'): SwapExecution {
  return createExecution({
    route: {
      requestId,
      result: { outputAmount: '2', resultType: 'OK', swaps: [{}] },
    } as unknown as ConfirmedRoute,
    wallets: { ARBITRUM: { walletType: 'metamask', address: '0xWALLET' } },
    settings: { slippage: '1' },
    validateBalanceOrFee: true,
  });
}

describe('IdbStore', () => {
  beforeEach(() => {
    // A fresh IndexedDB per test, so databases never leak between them.
    globalThis.indexedDB = new IDBFactory();
  });

  it('stores and lists executions by request id', async () => {
    const store = new IdbStore();
    const exec = execution();

    await store.insert(exec);

    expect(await store.get('req-1')).toEqual(exec);
    expect(await store.getAll()).toEqual([exec]);
  });

  it('keeps executions for a store opened later on the same database', async () => {
    const exec = execution();
    await new IdbStore().insert(exec);

    const reopened = new IdbStore();

    expect(await reopened.get('req-1')).toEqual(exec);
  });

  it('keeps databases with different names apart', async () => {
    await new IdbStore({ dbName: 'one' }).insert(execution());

    expect(await new IdbStore({ dbName: 'two' }).getAll()).toEqual([]);
  });

  it('refuses to insert the same request id twice', async () => {
    const store = new IdbStore();
    await store.insert(execution());

    await expect(store.insert(execution())).rejects.toThrow(RangoSdkError);
    expect(await store.getAll()).toHaveLength(1);
  });

  it('accepts a write that is exactly one version ahead', async () => {
    const store = new IdbStore();
    const exec = execution();
    await store.insert(exec);

    const next = { ...exec, version: 1 };
    await store.update(next);

    expect(await store.get('req-1')).toEqual(next);
  });

  it.each([
    ['the same version', 0],
    ['two versions ahead', 2],
  ])('refuses a write that is %s', async (_, version) => {
    const store = new IdbStore();
    const exec = execution();
    await store.insert(exec);

    await expect(store.update({ ...exec, version })).rejects.toThrow(
      RangoSdkError
    );
    expect(await store.get('req-1')).toEqual(exec);
  });

  it('refuses a stale write from another store on the same database', async () => {
    const first = new IdbStore();
    const second = new IdbStore();
    const exec = execution();
    await first.insert(exec);
    await first.update({ ...exec, version: 1 });

    await expect(second.update({ ...exec, version: 1 })).rejects.toThrow(
      RangoSdkError
    );
    expect(await second.get('req-1')).toEqual({ ...exec, version: 1 });
  });

  it('throws for a request id it does not hold', async () => {
    const store = new IdbStore();

    await expect(store.get('missing')).rejects.toThrow(RangoSdkError);
    await expect(store.update(execution())).rejects.toThrow(RangoSdkError);
  });

  it('forgets a deleted execution', async () => {
    const store = new IdbStore();
    await store.insert(execution());

    await store.delete('req-1');

    expect(await store.getAll()).toEqual([]);
  });

  it('ignores a delete for a request id it does not hold', async () => {
    const store = new IdbStore();
    await store.insert(execution());

    await store.delete('missing');

    expect(await store.getAll()).toHaveLength(1);
  });
});
