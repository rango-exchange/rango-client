import { describe, expect, it } from 'vitest';

import { RangoSdkError } from '../../src/errors';
import { MemoryStore } from '../../src/execution/store';

import { execution } from './fakes';

describe('MemoryStore', () => {
  it('stores and lists executions by request id', async () => {
    const store = new MemoryStore();
    const exec = execution(null);

    await store.insert(exec);

    expect(await store.get('req-1')).toBe(exec);
    expect(await store.getAll()).toEqual([exec]);
  });

  it('refuses to insert the same request id twice', async () => {
    const store = new MemoryStore();
    await store.insert(execution(null));

    await expect(store.insert(execution(null))).rejects.toThrow(RangoSdkError);
  });

  it('accepts a write that is exactly one version ahead', async () => {
    const store = new MemoryStore();
    const exec = execution(null);
    await store.insert(exec);

    const next = { ...exec, version: 1 };
    await store.update(next);

    expect(await store.get('req-1')).toBe(next);
  });

  it.each([
    ['the same version', 0],
    ['two versions ahead', 2],
  ])('refuses a write that is %s', async (_, version) => {
    const store = new MemoryStore();
    const exec = execution(null);
    await store.insert(exec);

    await expect(store.update({ ...exec, version })).rejects.toThrow(
      RangoSdkError
    );
    expect(await store.get('req-1')).toBe(exec);
  });

  it('throws for a request id it does not hold', async () => {
    const store = new MemoryStore();

    await expect(store.get('missing')).rejects.toThrow(RangoSdkError);
    await expect(store.update(execution(null))).rejects.toThrow(RangoSdkError);
  });

  it('forgets a deleted execution', async () => {
    const store = new MemoryStore();
    await store.insert(execution(null));

    await store.delete('req-1');

    expect(await store.getAll()).toEqual([]);
  });
});
