import type { EngineEvent } from '../../src/execution/engine';
import type { RangoClient, Transaction } from 'rango-sdk';
import type { GenericSigner } from 'rango-types';

import {
  SignerError,
  SignerErrorCode,
  TransactionStatus,
  TransactionType,
} from 'rango-types';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { RangoSdkError } from '../../src/errors';
import { Engine } from '../../src/execution/engine';
import { MemoryStore } from '../../src/execution/store';

import {
  CHAIN_IDS,
  execution,
  fakeEvmNamespace,
  fakeProvider,
  fakeSigner,
  HYPERLIQUID_SIGNATURE,
  hyperliquidTransaction,
  META,
  stubFetch,
  transaction,
} from './fakes';

const swapTx = transaction([], {
  type: TransactionType.EVM,
  blockChain: 'ARBITRUM',
});

/** An API that builds one transaction and reports it successful on the first poll. */
function fakeClient(tx: Transaction) {
  return {
    createTransaction: vi
      .fn()
      .mockResolvedValue({ ok: true, error: null, transaction: tx }),
    checkStatus: vi.fn().mockResolvedValue({
      status: TransactionStatus.SUCCESS,
      outputAmount: '2',
      explorerUrl: [{ url: 'https://scan/tx', description: 'Swap' }],
      steps: null,
      diagnosisUrl: null,
      extraMessage: null,
      newTx: null,
    }),
  };
}

function setup(
  signAndSendTx = vi.fn().mockResolvedValue({ hash: 'TXHASH' }),
  evm = fakeEvmNamespace(),
  overrides: {
    /** The transaction the API builds; the EVM swap by default. */
    tx?: Transaction;
    signTypedData?: GenericSigner<Transaction>['signTypedData'];
  } = {}
) {
  const httpClient = fakeClient(overrides.tx ?? swapTx);
  const store = new MemoryStore();
  const provider = fakeProvider({
    namespaces: { evm },
    signer: fakeSigner(signAndSendTx, overrides.signTypedData),
  });
  const engine = new Engine({
    httpClient: httpClient as unknown as RangoClient,
    store,
    getProvider: () => provider,
    getMeta: () => META,
  });
  const events: EngineEvent[] = [];
  engine.subscribe((event) => events.push(event));
  return { engine, store, httpClient, events, signAndSendTx };
}

/** Lets every loop turn that is already queued run. */
async function tick(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe('Engine', () => {
  it('runs a one-step swap from a fresh record to success', async () => {
    const { engine, store, events, signAndSendTx } = setup();

    const result = await engine.execute(execution(null));

    expect(result).toEqual({ hash: 'TXHASH' });
    expect(events.map((event) => event.transition.type)).toEqual([
      'started',
      'step_started',
      'tx_built',
      'sign_requested',
      'tx_sent',
      'tracking',
      'step_succeeded',
      'succeeded',
    ]);
    expect(signAndSendTx).toHaveBeenCalledWith(
      swapTx,
      '0xWALLET',
      CHAIN_IDS.ARBITRUM
    );

    const stored = await store.get('req-1');
    expect(stored).toMatchObject({
      status: 'success',
      version: events.length,
      steps: [
        {
          status: 'success',
          tx: swapTx,
          hash: 'TXHASH',
          outputAmount: '2',
          explorerUrls: [{ url: 'https://scan/tx', description: 'Swap' }],
        },
      ],
    });
    expect(stored.finishedAt).not.toBeNull();
  });

  it('hands listeners the record as it is after each transition', async () => {
    const { engine, events } = setup();

    await engine.execute(execution(null));

    const sent = events.find((event) => event.transition.type === 'tx_sent');
    expect(sent?.execution.steps[0].hash).toBe('TXHASH');
    expect(events.map((event) => event.execution.version)).toEqual(
      events.map((_, index) => index + 1)
    );
  });

  it('fails the swap and rejects the caller when the wallet refuses to sign', async () => {
    const { engine, store, events } = setup(
      vi
        .fn()
        .mockRejectedValue(new SignerError(SignerErrorCode.REJECTED_BY_USER))
    );

    const promise = engine.execute(execution(null));

    await expect(promise).rejects.toThrow(RangoSdkError);
    await expect(promise).rejects.toMatchObject({
      cause: { code: 'REJECTED_BY_USER', phase: 'execute_transaction' },
    });
    expect(events.map((event) => event.transition.type)).toEqual([
      'started',
      'step_started',
      'tx_built',
      'sign_requested',
      'failed',
    ]);
    expect(await store.get('req-1')).toMatchObject({
      status: 'failed',
      failure: { code: 'REJECTED_BY_USER', phase: 'sign', origin: 'client' },
      steps: [{ status: 'failed', signRequestedAt: expect.any(Number) }],
    });
  });

  it('parks the swap, leaving the caller waiting, when the wallet is not ready to sign', async () => {
    const { engine, store, events, signAndSendTx } = setup(
      vi.fn(),
      fakeEvmNamespace({}, { connected: false })
    );
    let settled = false;

    void engine.execute(execution(null)).finally(() => {
      settled = true;
    });
    await vi.waitFor(() =>
      expect(events.at(-1)?.transition.type).toBe('blocked')
    );

    // No sign request: the wallet was never asked.
    expect(events.map((event) => event.transition.type)).toEqual([
      'started',
      'step_started',
      'tx_built',
      'blocked',
    ]);
    expect(await store.get('req-1')).toMatchObject({
      status: 'running',
      steps: [
        {
          status: 'running',
          hash: null,
          signRequestedAt: null,
          blocked: { reason: 'wallet_disconnected', walletType: 'metamask' },
        },
      ],
    });
    expect(signAndSendTx).not.toHaveBeenCalled();
    expect(settled).toBe(false);
  });

  it('resumes a parked swap when the wallet it waits on reports a change', async () => {
    const evm = fakeEvmNamespace({}, { connected: false });
    const { engine, events, signAndSendTx } = setup(
      vi.fn().mockResolvedValue({ hash: 'TXHASH' }),
      evm
    );
    const promise = engine.execute(execution(null));
    await vi.waitFor(() =>
      expect(events.at(-1)?.transition.type).toBe('blocked')
    );

    evm.state()[1]('connected', true);
    await engine.notify({ type: 'wallet_connected', walletType: 'metamask' });

    expect(await promise).toEqual({ hash: 'TXHASH' });
    expect(events.map((event) => event.transition.type)).toEqual([
      'started',
      'step_started',
      'tx_built',
      'blocked',
      'unblocked',
      'sign_requested',
      'tx_sent',
      'tracking',
      'step_succeeded',
      'succeeded',
    ]);
    expect(signAndSendTx).toHaveBeenCalledOnce();
  });

  it('parks a resumed swap again under the reason that now applies', async () => {
    const evm = fakeEvmNamespace({}, { connected: false });
    const { engine, store, events } = setup(vi.fn(), evm);
    void engine.execute(execution(null));
    await vi.waitFor(() =>
      expect(events.at(-1)?.transition.type).toBe('blocked')
    );

    evm.state()[1]('connected', true);
    evm.state()[1]('accounts', ['eip155:42161:0xOTHER']);
    await engine.notify({
      type: 'wallet_accounts_changed',
      walletType: 'metamask',
    });
    await vi.waitFor(() =>
      expect(events.at(-1)?.transition).toMatchObject({
        type: 'blocked',
        block: { reason: 'wrong_account' },
      })
    );

    expect(events.filter((e) => e.transition.type === 'blocked')).toHaveLength(
      2
    );
    expect((await store.get('req-1')).steps[0].blocked).toMatchObject({
      reason: 'wrong_account',
      requiredAddress: '0xWALLET',
    });
  });

  it('records nothing when a wake finds the same block, or the event is for another wallet', async () => {
    const { engine, events } = setup(
      vi.fn(),
      fakeEvmNamespace({}, { connected: false })
    );
    void engine.execute(execution(null));
    await vi.waitFor(() =>
      expect(events.at(-1)?.transition.type).toBe('blocked')
    );
    const count = events.length;

    await engine.notify({ type: 'wallet_connected', walletType: 'phantom' });
    await engine.notify({ type: 'wallet_connected', walletType: 'metamask' });
    await tick();

    expect(events).toHaveLength(count);
  });

  it('does not start a second loop for an execution whose loop is running', async () => {
    let releaseSign!: (value: { hash: string }) => void;
    const signAndSendTx = vi.fn().mockReturnValue(
      new Promise<{ hash: string }>((resolve) => {
        releaseSign = resolve;
      })
    );
    const { engine } = setup(signAndSendTx);
    const promise = engine.execute(execution(null));
    await vi.waitFor(() => expect(signAndSendTx).toHaveBeenCalledOnce());

    await engine.resume();
    await tick();
    expect(signAndSendTx).toHaveBeenCalledOnce();

    releaseSign({ hash: 'TXHASH' });
    expect(await promise).toEqual({ hash: 'TXHASH' });
  });

  it('stops telling a listener after it unsubscribes', async () => {
    const { engine } = setup();
    const listener = vi.fn();
    const unsubscribe = engine.subscribe(listener);
    unsubscribe();

    await engine.execute(execution(null));

    expect(listener).not.toHaveBeenCalled();
  });

  it('refuses to start the same request twice', async () => {
    const { engine } = setup();
    await engine.execute(execution(null));

    await expect(engine.execute(execution(null))).rejects.toThrow(
      RangoSdkError
    );
  });
});

describe('Engine with a Hyperliquid step', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('submits the action, looks its hash up, then tracks it like any other', async () => {
    const tx = hyperliquidTransaction();
    const fetchMock = stubFetch(
      { status: 'ok' },
      {
        txs: [
          { hash: 'HLHASH', action: { type: 'withdraw3', time: tx.nonce } },
        ],
      }
    );
    const signTypedData = vi.fn().mockResolvedValue(HYPERLIQUID_SIGNATURE);
    const { engine, events, httpClient } = setup(vi.fn(), fakeEvmNamespace(), {
      tx,
      signTypedData,
    });

    const result = await engine.execute(execution(null));

    expect(result).toEqual({ hash: 'HLHASH' });
    expect(events.map((event) => event.transition.type)).toEqual([
      'started',
      'step_started',
      'tx_built',
      'sign_requested',
      'tx_submitted',
      'tx_sent',
      'tracking',
      'step_succeeded',
      'succeeded',
    ]);
    expect(signTypedData).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(httpClient.checkStatus).toHaveBeenCalledWith(
      expect.objectContaining({ txId: 'HLHASH' })
    );
  });
});

describe('Engine cancel', () => {
  it('fails a parked swap with USER_CANCEL and rejects the caller', async () => {
    const { engine, store, events } = setup(
      vi.fn(),
      fakeEvmNamespace({}, { connected: false })
    );
    const promise = engine.execute(execution(null));
    await vi.waitFor(() =>
      expect(events.at(-1)?.transition.type).toBe('blocked')
    );

    await engine.cancel('req-1');

    await expect(promise).rejects.toMatchObject({
      cause: { code: 'USER_CANCEL', phase: 'cancel', stepIndex: 0 },
    });
    expect(events.at(-1)?.transition.type).toBe('failed');
    expect(await store.get('req-1')).toMatchObject({
      status: 'failed',
      failure: { code: 'USER_CANCEL', phase: 'cancel', origin: 'client' },
      steps: [{ status: 'failed' }],
    });
  });

  it('drops what the wallet comes back with after the cancel', async () => {
    let releaseSign!: (value: { hash: string }) => void;
    const signAndSendTx = vi.fn().mockReturnValue(
      new Promise<{ hash: string }>((resolve) => {
        releaseSign = resolve;
      })
    );
    const { engine, store, events } = setup(signAndSendTx);
    const promise = engine.execute(execution(null));
    await vi.waitFor(() => expect(signAndSendTx).toHaveBeenCalledOnce());

    await engine.cancel('req-1');
    const rejection = expect(promise).rejects.toMatchObject({
      cause: { code: 'USER_CANCEL' },
    });
    releaseSign({ hash: 'TXHASH' });
    await tick();

    await rejection;
    expect(events.map((event) => event.transition.type)).toEqual([
      'started',
      'step_started',
      'tx_built',
      'sign_requested',
      'failed',
    ]);
    expect((await store.get('req-1')).steps[0].hash).toBeNull();
  });

  it('keeps the wallet from being asked when the cancel lands during the guard', async () => {
    let releaseGuard!: (chainId: string) => void;
    const evm = fakeEvmNamespace({
      getChainId: vi.fn().mockReturnValue(
        new Promise<string>((resolve) => {
          releaseGuard = resolve;
        })
      ),
    });
    const { engine, events, signAndSendTx } = setup(
      vi.fn().mockResolvedValue({ hash: 'TXHASH' }),
      evm
    );
    const promise = engine.execute(execution(null));
    await vi.waitFor(() => expect(evm.getChainId).toHaveBeenCalled());

    await engine.cancel('req-1');
    const rejection = expect(promise).rejects.toMatchObject({
      cause: { code: 'USER_CANCEL' },
    });
    releaseGuard(CHAIN_IDS.ARBITRUM);
    await tick();

    await rejection;
    expect(signAndSendTx).not.toHaveBeenCalled();
    expect(events.map((event) => event.transition.type)).toEqual([
      'started',
      'step_started',
      'tx_built',
      'failed',
    ]);
  });

  it('leaves a finished swap as it is', async () => {
    const { engine, store, events } = setup();
    await engine.execute(execution(null));
    const count = events.length;

    await engine.cancel('req-1');

    expect(events).toHaveLength(count);
    expect((await store.get('req-1')).status).toBe('success');
  });
});

describe('Engine commits', () => {
  it('run one at a time per execution, so a cancel never clashes with the loop', async () => {
    const { engine, store } = setup();
    await store.insert(execution(null));

    await Promise.all([
      engine.commit('req-1', { type: 'started' }),
      engine.commit('req-1', { type: 'started' }),
    ]);

    expect((await store.get('req-1')).version).toBe(2);
  });

  it('go on when a listener throws', async () => {
    const { engine } = setup();
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    engine.subscribe(() => {
      throw new Error('render bug');
    });
    const later = vi.fn();
    engine.subscribe(later);

    const result = await engine.execute(execution(null));

    expect(result).toEqual({ hash: 'TXHASH' });
    expect(later).toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});

describe('Engine resume', () => {
  it('expires a step whose sign request was open at the last reload, instead of asking again', async () => {
    const { engine, store, events, signAndSendTx } = setup();
    await store.insert(
      execution(swapTx, [], { status: 'running', signRequestedAt: 1 })
    );

    await engine.resume();
    await vi.waitFor(() =>
      expect(events.at(-1)?.transition.type).toBe('failed')
    );

    expect(signAndSendTx).not.toHaveBeenCalled();
    expect(await store.get('req-1')).toMatchObject({
      status: 'failed',
      failure: {
        code: 'TX_EXPIRED',
        phase: 'sign',
        stepIndex: 0,
        detail: expect.stringContaining('never answered'),
      },
      steps: [{ status: 'failed', hash: null }],
    });
  });
});

describe('Engine pause', () => {
  it('commits what the action in flight returns, then stops until resumed', async () => {
    let releaseSign!: (value: { hash: string }) => void;
    const signAndSendTx = vi.fn().mockReturnValue(
      new Promise<{ hash: string }>((resolve) => {
        releaseSign = resolve;
      })
    );
    const { engine, store, events, httpClient } = setup(signAndSendTx);
    const promise = engine.execute(execution(null));
    await vi.waitFor(() => expect(signAndSendTx).toHaveBeenCalledOnce());

    engine.pause();
    releaseSign({ hash: 'TXHASH' });
    await vi.waitFor(() =>
      expect(events.at(-1)?.transition.type).toBe('tx_sent')
    );
    await tick();

    expect(engine.isPaused).toBe(true);
    expect(httpClient.checkStatus).not.toHaveBeenCalled();
    expect(await store.get('req-1')).toMatchObject({
      status: 'running',
      steps: [{ hash: 'TXHASH' }],
    });

    await engine.resume();

    expect(await promise).toEqual({ hash: 'TXHASH' });
    expect(engine.isPaused).toBe(false);
    expect(events.map((event) => event.transition.type)).toEqual([
      'started',
      'step_started',
      'tx_built',
      'sign_requested',
      'tx_sent',
      'tracking',
      'step_succeeded',
      'succeeded',
    ]);
  });

  it('refuses to start a swap and stores nothing', async () => {
    const { engine, store } = setup();
    engine.pause();

    await expect(engine.execute(execution(null))).rejects.toThrow(
      RangoSdkError
    );

    expect(await store.getAll()).toEqual([]);
  });

  it('ignores wallet events, and resume picks the parked swap up', async () => {
    const evm = fakeEvmNamespace({}, { connected: false });
    const { engine, events, signAndSendTx } = setup(
      vi.fn().mockResolvedValue({ hash: 'TXHASH' }),
      evm
    );
    const promise = engine.execute(execution(null));
    await vi.waitFor(() =>
      expect(events.at(-1)?.transition.type).toBe('blocked')
    );
    const count = events.length;

    engine.pause();
    evm.state()[1]('connected', true);
    await engine.notify({ type: 'wallet_connected', walletType: 'metamask' });
    await tick();

    expect(events).toHaveLength(count);
    expect(signAndSendTx).not.toHaveBeenCalled();

    await engine.resume();

    expect(await promise).toEqual({ hash: 'TXHASH' });
  });

  it('leaves finished executions alone on resume', async () => {
    const { engine, store, events } = setup();
    await store.insert({
      ...execution(swapTx, [], { status: 'success', hash: 'TXHASH' }),
      status: 'success',
    });

    await engine.resume();
    await tick();

    expect(events).toEqual([]);
  });
});
