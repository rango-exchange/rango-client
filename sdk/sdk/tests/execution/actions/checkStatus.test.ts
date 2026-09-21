import type { RangoClient, TransactionStatusResponse } from 'rango-sdk';

import { TransactionStatus, TransactionType } from 'rango-types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { checkStatus } from '../../../src/execution/actions/checkStatus';
import { execution, failure, transaction } from '../fakes';

const swapTx = transaction([], {
  type: TransactionType.EVM,
  blockChain: 'ARBITRUM',
});

const httpClient = {
  checkStatus: vi.fn(),
};
const params = {
  stepIndex: 0,
  httpClient: httpClient as unknown as RangoClient,
};
const failed = (code: string) => failure(code, 'check_status');

function statusResponse(
  fields: Partial<TransactionStatusResponse>
): TransactionStatusResponse {
  return {
    status: TransactionStatus.RUNNING,
    timestamp: null,
    extraMessage: null,
    outputAmount: null,
    outputToken: null,
    outputType: null,
    newTx: null,
    diagnosisUrl: null,
    explorerUrl: null,
    referrals: null,
    steps: null,
    bridgeExtra: null,
    error: null,
    errorCode: null,
    traceId: null,
    ...fields,
  };
}

const sent = { hash: 'TXHASH' };

beforeEach(() => {
  vi.clearAllMocks();
});

describe('checkStatus', () => {
  it.each([
    ['no transaction', execution(null, [], sent)],
    ['no hash', execution(swapTx)],
  ])('fails the swap when the step has %s', async (_, exec) => {
    const transitions = await checkStatus(exec, params);

    expect(transitions).toMatchObject(failed('CLIENT_UNEXPECTED_BEHAVIOUR'));
    expect(httpClient.checkStatus).not.toHaveBeenCalled();
  });
});

describe('a swap transaction', () => {
  const exec = () => execution(swapTx, [], sent);

  it('asks the API about the step by its 1-based number', async () => {
    httpClient.checkStatus.mockResolvedValue(statusResponse({}));

    await checkStatus(exec(), params);

    expect(httpClient.checkStatus).toHaveBeenCalledWith({
      requestId: 'req-1',
      txId: 'TXHASH',
      step: 1,
    });
  });

  it('reports what the API knows while the transaction is running', async () => {
    const internalSteps = [{ name: 'bridge', state: 'RUNNING' }];
    httpClient.checkStatus.mockResolvedValue(
      statusResponse({
        outputAmount: '1.5',
        steps: internalSteps as TransactionStatusResponse['steps'],
        diagnosisUrl: 'https://diagnose',
        explorerUrl: [{ url: 'https://scan/tx', description: 'Swap' }],
        extraMessage: 'waiting for the bridge',
      })
    );

    const transitions = await checkStatus(exec(), params);

    expect(transitions).toEqual([
      {
        type: 'tracking',
        stepIndex: 0,
        outputAmount: '1.5',
        internalSteps,
        diagnosisUrl: 'https://diagnose',
        explorerUrls: [{ url: 'https://scan/tx', description: 'Swap' }],
        statusMessage: 'waiting for the bridge',
      },
    ]);
  });

  it('reports tracking alone when the API has no status yet', async () => {
    httpClient.checkStatus.mockResolvedValue(statusResponse({ status: null }));

    const transitions = await checkStatus(exec(), params);

    expect(transitions).toMatchObject([{ type: 'tracking' }]);
  });

  it('succeeds the step after tracking once the API is final', async () => {
    httpClient.checkStatus.mockResolvedValue(
      statusResponse({ status: TransactionStatus.SUCCESS, outputAmount: '2' })
    );

    const transitions = await checkStatus(exec(), params);

    expect(transitions).toMatchObject([
      { type: 'tracking', outputAmount: '2' },
      { type: 'step_succeeded', stepIndex: 0, outputAmount: '2' },
    ]);
  });

  it('falls back to the amount the step already knows when success carries none', async () => {
    httpClient.checkStatus.mockResolvedValue(
      statusResponse({ status: TransactionStatus.SUCCESS })
    );

    const transitions = await checkStatus(
      execution(swapTx, [], { ...sent, outputAmount: '1.9' }),
      params
    );

    expect(transitions).toMatchObject([
      { type: 'tracking' },
      { type: 'step_succeeded', outputAmount: '1.9' },
    ]);
  });

  it('fails the swap after tracking when the transaction failed on chain', async () => {
    httpClient.checkStatus.mockResolvedValue(
      statusResponse({
        status: TransactionStatus.FAILED,
        extraMessage: 'slippage exceeded',
      })
    );

    const transitions = await checkStatus(exec(), params);

    expect(transitions).toMatchObject([
      { type: 'tracking', statusMessage: 'slippage exceeded' },
      {
        ...failed('TX_FAILED_IN_BLOCKCHAIN')[0],
        failure: { message: 'slippage exceeded', origin: 'backend' },
      },
    ]);
  });

  it('hands over the replacement transaction when the API renews it', async () => {
    const newTx = transaction([], {
      type: TransactionType.EVM,
      blockChain: 'ARBITRUM',
    });
    httpClient.checkStatus.mockResolvedValue(statusResponse({ newTx }));

    const transitions = await checkStatus(exec(), params);

    expect(transitions).toMatchObject([
      { type: 'tracking' },
      { type: 'tx_renewed', stepIndex: 0, tx: newTx },
    ]);
  });

  it('throws for the loop to retry when the request fails', async () => {
    httpClient.checkStatus.mockRejectedValue(new Error('network'));

    await expect(checkStatus(exec(), params)).rejects.toThrow('network');
  });
});
