import type { ConfirmQuoteIssue } from '../../src/confirmation/types';

import { describe, expect, it } from 'vitest';

import { getRouteChains } from '../../src/confirmation/chains';
import {
  findMissingWallets,
  findRouteIssue,
  toConfirmError,
} from '../../src/confirmation/validate';
import { RangoSdkError } from '../../src/errors';

import { asset, route, swap, wallet } from './fakes';

const ETH = asset('ETH');
const BSC = asset('BSC');
const POLYGON = asset('POLYGON');
const ARB = asset('ARB');

/** ETH to BSC through a bridge that hops POLYGON to ARB to BSC inside. */
const bridged = [
  swap(ETH, BSC, { internalSwaps: [swap(POLYGON, ARB), swap(ARB, BSC)] }),
];

describe('getRouteChains', () => {
  it('lists the chains the user signs on, in route order', () => {
    expect(getRouteChains(bridged, 'required')).toEqual([
      'ETH',
      'POLYGON',
      'ARB',
    ]);
  });

  it('adds the chains that only receive', () => {
    expect(getRouteChains(bridged, 'all')).toEqual([
      'ETH',
      'POLYGON',
      'ARB',
      'BSC',
    ]);
  });
});

describe('findMissingWallets', () => {
  const signing = [wallet('ETH'), wallet('POLYGON'), wallet('ARB')];

  it('needs a wallet on the last chain to receive the output', () => {
    expect(findMissingWallets(bridged, signing, false)).toEqual({
      type: 'missing_wallets',
      chains: ['BSC'],
    });
  });

  it('does not need one there when a custom destination receives it', () => {
    expect(findMissingWallets(bridged, signing, true)).toBeNull();
  });

  it('names every chain without a wallet, in route order', () => {
    expect(
      findMissingWallets(bridged, [wallet('ETH'), wallet('ARB')], false)
    ).toMatchObject({ chains: ['POLYGON', 'BSC'] });
  });
});

describe('findRouteIssue', () => {
  it('reports a route the API could not find, with its diagnosis', () => {
    expect(
      findRouteIssue(route([], { diagnosisMessages: ['no liquidity'] }))
    ).toEqual({ type: 'no_result', diagnosisMessage: 'no liquidity' });
    expect(findRouteIssue(route([]))).toEqual({
      type: 'no_result',
      diagnosisMessage: null,
    });
  });

  it('reports the first step whose input is outside its range', () => {
    const swaps = [
      swap(ETH, ETH),
      swap(ETH, BSC, { fromAmount: '1', fromAmountMinValue: '2' }),
    ];

    expect(findRouteIssue(route(swaps))).toEqual({
      type: 'amount_out_of_range',
      stepIndex: 1,
      amount: '1',
      min: '2',
      max: null,
      restrictionType: 'INCLUSIVE',
    });
  });

  it('accepts an input on the bound unless the range excludes it', () => {
    const onBound = { fromAmount: '1', fromAmountMinValue: '1' };

    expect(findRouteIssue(route([swap(ETH, BSC, onBound)]))).toBeNull();
    expect(
      findRouteIssue(
        route([
          swap(ETH, BSC, {
            ...onBound,
            fromAmountRestrictionType: 'EXCLUSIVE',
          }),
        ])
      )
    ).toMatchObject({
      type: 'amount_out_of_range',
      restrictionType: 'EXCLUSIVE',
    });
  });

  it('reports the steps that rejected the slippage, and the lowest that satisfies all', () => {
    const swaps = [
      swap(ETH, ETH, { recommendedSlippage: { error: false, slippage: '1' } }),
      swap(ETH, BSC, { recommendedSlippage: { error: true, slippage: '3' } }),
    ];

    expect(findRouteIssue(route(swaps))).toEqual({
      type: 'insufficient_slippage',
      recommendedSlippages: { 1: '3' },
      minRequiredSlippage: '3',
    });
  });

  it('accepts a route with nothing wrong', () => {
    expect(findRouteIssue(route(bridged))).toBeNull();
  });
});

describe('toConfirmError', () => {
  it('wraps the issue as the cause of a worded error', () => {
    const issue: ConfirmQuoteIssue = {
      type: 'missing_wallets',
      chains: ['BSC'],
    };
    const error = toConfirmError(issue);

    expect(error).toBeInstanceOf(RangoSdkError);
    expect(error.cause).toBe(issue);
    expect(error.message).toMatch(/wallet/);
  });
});
