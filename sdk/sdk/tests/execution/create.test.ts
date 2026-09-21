import type { ConfirmedRoute } from '../../src/confirmation/types';
import type { SwapResult } from 'rango-sdk';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RangoSdkError } from '../../src/errors';
import { createExecution } from '../../src/execution/create';

const NOW = 1_700_000_000_000;

/** Only the fields a reader of the route would look at; the cast covers the rest. */
function swap(swapperId: string): SwapResult {
  return {
    swapperId,
    from: { blockchain: 'ETH', symbol: 'ETH', address: null },
    to: { blockchain: 'BSC', symbol: 'BNB', address: null },
  } as SwapResult;
}

function route(swaps: SwapResult[]): ConfirmedRoute {
  return {
    requestId: 'req-1',
    requestAmount: '1',
    from: { blockchain: 'ETH', symbol: 'ETH', address: null },
    to: { blockchain: 'BSC', symbol: 'BNB', address: null },
    result: { outputAmount: '2', resultType: 'OK', swaps },
    validationStatus: [],
    diagnosisMessages: [],
    missingBlockchains: [],
    walletNotSupportingFromBlockchain: false,
  } as ConfirmedRoute;
}

const params = {
  wallets: { ETH: { walletType: 'metamask', address: '0xabc' } },
  settings: { slippage: '1', infiniteApprove: false },
  validateBalanceOrFee: true,
};

describe('createExecution', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts a running record at version 0 with nothing finished', () => {
    const confirmed = route([swap('uniswap'), swap('stargate')]);

    const exec = createExecution({ route: confirmed, ...params });

    expect(exec).toMatchObject({
      requestId: 'req-1',
      version: 0,
      createdAt: NOW,
      finishedAt: null,
      status: 'running',
      failure: null,
      mode: 'swap',
      wallets: params.wallets,
      settings: params.settings,
      validateBalanceOrFee: true,
    });
    expect(exec.route).toBe(confirmed);
  });

  it('adds one pending step per swap, with nothing produced', () => {
    const exec = createExecution({
      route: route([swap('uniswap'), swap('stargate')]),
      ...params,
    });

    expect(exec.steps).toHaveLength(2);
    for (const step of exec.steps) {
      expect(step).toEqual({
        status: 'pending',
        tx: null,
        hash: null,
        signRequestedAt: null,
        submittedAt: null,
        explorerUrls: [],
        diagnosisUrl: null,
        outputAmount: null,
        internalSteps: null,
        statusMessage: null,
        prerequisiteResults: [],
        blocked: null,
      });
    }
  });

  it('keeps the mode and the balance choice the caller passes', () => {
    const exec = createExecution({
      route: route([swap('uniswap')]),
      ...params,
      mode: 'refuel',
      validateBalanceOrFee: false,
    });

    expect(exec.mode).toBe('refuel');
    expect(exec.validateBalanceOrFee).toBe(false);
  });

  it('rejects a route with nothing to run', () => {
    expect(() => createExecution({ route: route([]), ...params })).toThrow(
      RangoSdkError
    );
    expect(() =>
      createExecution({ route: { ...route([]), result: null }, ...params })
    ).toThrow(RangoSdkError);
  });
});
