import type { ClientEvent } from '../../src/client/types';
import type * as RangoSdk from 'rango-sdk';

import { TransactionStatus, TransactionType } from 'rango-types';
import { describe, expect, it, vi } from 'vitest';

import { RangoSdkClient } from '../../src/client/client';
import { RangoSdkError } from '../../src/errors';
import {
  execution,
  fakeEvmNamespace,
  fakeProvider,
  META,
  transaction,
} from '../execution/fakes';

/** The API behind the client, replaced for the whole file. */
const { api } = vi.hoisted(() => ({
  api: { createTransaction: vi.fn(), checkStatus: vi.fn() },
}));

vi.mock('rango-sdk', async (importOriginal) => ({
  ...(await importOriginal<typeof RangoSdk>()),
  RangoClient: class {
    createTransaction = api.createTransaction;
    checkStatus = api.checkStatus;
  },
}));

/** Builds one EVM transaction and reports it successful on the first poll. */
function setup() {
  api.createTransaction.mockResolvedValue({
    ok: true,
    error: null,
    transaction: transaction([], {
      type: TransactionType.EVM,
      blockChain: 'ARBITRUM',
    }),
  });
  api.checkStatus.mockResolvedValue({
    status: TransactionStatus.SUCCESS,
    outputAmount: '2',
    explorerUrl: null,
    steps: null,
    diagnosisUrl: null,
    extraMessage: null,
    newTx: null,
  });
  const provider = fakeProvider({ namespaces: { evm: fakeEvmNamespace() } });
  const client = new RangoSdkClient({
    apiKey: 'key',
    getProvider: () => provider,
    getMeta: () => META,
  });
  const events: ClientEvent[] = [];
  const unsubscribe = client.subscribe((event) => events.push(event));
  return { client, events, unsubscribe };
}

function kinds(events: ClientEvent[]): string[] {
  return events.map((event) =>
    event.type === 'transition' ? event.transition.type : event.type
  );
}

describe('RangoSdkClient', () => {
  it('tells subscribers about transitions and deletions in one stream', async () => {
    const { client, events } = setup();

    await client.execute(execution(null));
    await client.history.delete('req-1');

    expect(kinds(events)).toEqual([
      'started',
      'step_started',
      'tx_built',
      'sign_requested',
      'tx_sent',
      'tracking',
      'step_succeeded',
      'succeeded',
      'deleted',
    ]);
    expect(events.at(-1)).toEqual({ type: 'deleted', requestId: 'req-1' });
    expect(await client.history.getAll()).toEqual([]);
  });

  it('cancels through history and rejects the caller waiting on execute', async () => {
    const { client, events } = setup();
    const provider = fakeProvider({
      namespaces: { evm: fakeEvmNamespace({}, { connected: false }) },
    });
    client.setConfig({
      apiKey: 'key',
      getProvider: () => provider,
      getMeta: () => META,
    });
    const promise = client.execute(execution(null));
    await vi.waitFor(() => expect(kinds(events).at(-1)).toBe('blocked'));

    await client.history.cancel('req-1');

    await expect(promise).rejects.toMatchObject({
      cause: { code: 'USER_CANCEL' },
    });
    expect((await client.history.get('req-1')).status).toBe('failed');
  });

  it('stops both kinds of events once unsubscribed', async () => {
    const { client, events, unsubscribe } = setup();
    unsubscribe();

    await client.execute(execution(null));
    await client.history.delete('req-1');

    expect(events).toEqual([]);
  });
});

describe('RangoSdkClient pause', () => {
  it('refuses to start a swap while paused and runs again after resume', async () => {
    const { client } = setup();
    client.pause();

    expect(client.isPaused).toBe(true);
    await expect(client.execute(execution(null))).rejects.toThrow(
      RangoSdkError
    );

    await client.resume();

    expect(client.isPaused).toBe(false);
    expect(await client.execute(execution(null))).toEqual({ hash: 'HASH' });
  });
});
