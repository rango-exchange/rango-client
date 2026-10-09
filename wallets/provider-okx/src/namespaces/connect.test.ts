import { createStore, Hub3Error } from '@hub3js/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ton } from './ton/ton.js';
import { setEnvironments } from './ton/utils.js';
import { tron } from './tron.js';

const tronRequest = vi.fn();
const tonConnect = vi.fn();
const restoreConnection = vi.fn();

vi.mock('../utils.js', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  tronOKX: () => ({ request: tronRequest }),
  tonOKX: () => ({
    connect: tonConnect,
    restoreConnection,
    on: vi.fn(),
    off: vi.fn(),
  }),
}));

tron.store(createStore());
ton.store(createStore());
setEnvironments({
  tonConnectManifestUrl: 'https://example.com/tonconnect-manifest.json',
});

async function catchError(run: () => Promise<unknown>): Promise<unknown> {
  return run().then(
    () => undefined,
    (error: unknown) => error
  );
}

describe('okx tron connect', () => {
  beforeEach(() => {
    tronRequest.mockReset();
  });

  it('throw a rejection for the recorded 4001 result', async () => {
    const result = { code: 4001 };
    tronRequest.mockResolvedValue(result);

    const error = await catchError(async () => tron.connect());

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_USER_REJECTED_REQUEST',
      message: '',
      cause: result,
    });
  });

  it('throw an unexpected failure for another result code', async () => {
    const result = { code: 4000, message: 'Request failed' };
    tronRequest.mockResolvedValue(result);

    const error = await catchError(async () => tron.connect());

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_UNEXPECTED',
      message: 'Request failed',
      cause: result,
    });
  });
});

describe('okx ton connect', () => {
  beforeEach(() => {
    tonConnect.mockReset();
    restoreConnection.mockReset();
    restoreConnection.mockRejectedValue(new Error('No session'));
  });

  it('throw a rejection for the recorded connect_error event', async () => {
    const connectEvent = {
      event: 'connect_error',
      id: 1789403579821,
      payload: { code: 300, message: 'User rejected request' },
    };
    tonConnect.mockResolvedValue(connectEvent);

    const error = await catchError(async () => ton.connect());

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_USER_REJECTED_REQUEST',
      message: 'User rejected request',
      cause: connectEvent,
    });
  });

  it('throw an unexpected failure for another connect_error code', async () => {
    const connectEvent = {
      event: 'connect_error',
      id: 1,
      payload: { code: 0, message: 'Unknown error' },
    };
    tonConnect.mockResolvedValue(connectEvent);

    const error = await catchError(async () => ton.connect());

    expect(error).toBeInstanceOf(Hub3Error);
    expect(error).toMatchObject({
      type: 'PROVIDER_UNEXPECTED',
      cause: connectEvent,
    });
  });
});
