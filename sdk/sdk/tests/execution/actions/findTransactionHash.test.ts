import { TransactionType } from 'rango-types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RangoSdkError } from '../../../src/errors';
import { findTransactionHash } from '../../../src/execution/actions/findTransactionHash/mod';
import { HYPERLIQUID_EXPLORER_API_URL } from '../../../src/execution/actions/hyperliquid/mod';
import {
  execution,
  failure,
  hyperliquidTransaction,
  stubFetch,
  transaction,
} from '../fakes';

const params = { stepIndex: 0 };
const failed = (code: string) => failure(code, 'find_transaction_hash');
const NONCE = hyperliquidTransaction().nonce;

/** A step whose action went to the exchange and is waiting for its hash. */
const submitted = () =>
  execution(hyperliquidTransaction(), [], { submittedAt: 1 });

const listed = (hash: string, type: string, time: number) => ({
  hash,
  action: { type, time },
});

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('findTransactionHash', () => {
  it('reports the hash the explorer lists for the nonce', async () => {
    const fetchMock = stubFetch({
      type: 'userDetails',
      txs: [
        listed('OTHER', 'withdraw3', 1),
        listed('HLHASH', 'withdraw3', NONCE),
      ],
    });

    const transitions = await findTransactionHash(submitted(), params);

    expect(fetchMock).toHaveBeenCalledWith(
      HYPERLIQUID_EXPLORER_API_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ type: 'userDetails', user: '0xWALLET' }),
      })
    );
    expect(transitions).toEqual([
      { type: 'tx_sent', stepIndex: 0, hash: 'HLHASH', explorerUrl: null },
    ]);
  });

  it.each([
    ['nothing yet', []],
    ['only other nonces', [listed('X', 'usdSend', 1)]],
    ['only other kinds of action', [listed('X', 'spot', NONCE)]],
  ])('reports nothing while the explorer lists %s', async (_, txs) => {
    stubFetch({ type: 'userDetails', txs });

    const transitions = await findTransactionHash(submitted(), params);

    expect(transitions).toEqual([]);
  });

  it('throws for the loop to retry when the explorer cannot be reached', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

    await expect(findTransactionHash(submitted(), params)).rejects.toThrow(
      'offline'
    );
  });

  it('throws for the loop to retry when the explorer answers something else', async () => {
    stubFetch({ error: 'rate limited' });

    await expect(findTransactionHash(submitted(), params)).rejects.toThrow(
      RangoSdkError
    );
  });

  it('fails when the step has nothing submitted', async () => {
    const transitions = await findTransactionHash(
      execution(hyperliquidTransaction()),
      params
    );

    expect(transitions).toMatchObject(failed('CLIENT_UNEXPECTED_BEHAVIOUR'));
  });

  it('fails for a transaction whose hash comes with sending', async () => {
    const evmTx = transaction([], {
      type: TransactionType.EVM,
      blockChain: 'ARBITRUM',
    });

    const transitions = await findTransactionHash(
      execution(evmTx, [], { submittedAt: 1 }),
      params
    );

    expect(transitions).toMatchObject(failed('CLIENT_UNEXPECTED_BEHAVIOUR'));
  });

  it('fails when the swap has no wallet for the chain', async () => {
    const exec = submitted();
    delete exec.wallets.HYPERLIQUID;

    const transitions = await findTransactionHash(exec, params);

    expect(transitions).toMatchObject(failed('CLIENT_UNEXPECTED_BEHAVIOUR'));
  });
});
