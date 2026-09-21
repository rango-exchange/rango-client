/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { SdkMeta } from '../../src/execution/context';
import type { SwapResult, Token } from 'rango-sdk';

import { describe, expect, it } from 'vitest';

import { getQuoteWarnings } from '../../src/confirmation/warnings';

import { asset, fee, quote, route, swap } from './fakes';

const NO_SLIPPAGE_WARNINGS = { insufficientSlippage: null, highSlippage: null };

/** One step from an input worth `inputUsd` to an output worth `outputUsd`. */
function valued(
  inputUsd: number,
  outputUsd: number,
  fields: Partial<SwapResult> = {}
) {
  const swaps = [swap(asset('ETH', inputUsd), asset('BSC', 1), fields)];
  return route(swaps, { requestAmount: '1', outputAmount: String(outputUsd) });
}

type WarningParams = Parameters<typeof getQuoteWarnings>[0];

/** Runs the checks with the given meta, which has no tokens by default. */
function warnings(
  params: Omit<WarningParams, 'meta'>,
  meta: SdkMeta = { blockchains: [] }
) {
  return getQuoteWarnings({ ...params, meta });
}

function warningsOf(confirmed: ReturnType<typeof route>, slippage = '1') {
  const swaps = confirmed.result?.swaps ?? [];
  return warnings({ quote: quote(swaps), route: confirmed, slippage });
}

describe('getQuoteWarnings', () => {
  describe('highValueLoss', () => {
    it('flags a loss of a tenth on an input worth a few hundred dollars', () => {
      expect(warningsOf(valued(500, 450))).toMatchObject({
        highValueLoss: {
          priceImpact: -10,
          level: 'high',
          inputUsd: '500',
          outputUsd: '450',
        },
        unknownPrice: null,
        outputChange: null,
        ...NO_SLIPPAGE_WARNINGS,
      });
    });

    it('flags a loss of a twentieth as low on an input worth a thousand', () => {
      expect(warningsOf(valued(1000, 940))).toMatchObject({
        highValueLoss: { priceImpact: -6, level: 'low' },
      });
    });

    it('ignores a loss just short of the threshold', () => {
      expect(warningsOf(valued(500, 450.5)).highValueLoss).toBeNull();
    });

    it('ignores a large loss on a small input', () => {
      expect(warningsOf(valued(300, 200)).highValueLoss).toBeNull();
    });

    it('ignores a gain', () => {
      expect(warningsOf(valued(1000, 1100)).highValueLoss).toBeNull();
    });

    it('sums the fees paid from the wallet at the price the API gave', () => {
      const confirmed = valued(1000, 800, {
        fee: [
          fee('0.01', 3000),
          fee('1', 5),
          fee('1', null),
          fee('100', 1, 'DECREASE_FROM_OUTPUT'),
        ],
      });

      expect(warningsOf(confirmed).highValueLoss?.totalFeeUsd).toBe('35');
    });

    it("prices a fee from meta's token list first, then from the API", () => {
      const meta: SdkMeta = {
        blockchains: [],
        tokens: [
          {
            blockchain: 'eth',
            symbol: 'eth',
            address: null,
            usdPrice: 4000,
          } as Token,
        ],
      };
      const confirmed = valued(1000, 800, {
        fee: [
          fee('0.01', 3000),
          fee('1', 5, 'FROM_SOURCE_WALLET', {
            blockchain: 'BSC',
            symbol: 'BNB',
            address: null,
          }),
        ],
      });
      const swaps = confirmed.result?.swaps ?? [];

      const warning = warnings(
        { quote: quote(swaps), route: confirmed, slippage: '1' },
        meta
      ).highValueLoss;

      expect(warning?.totalFeeUsd).toBe('45');
    });
  });

  describe('unknownPrice', () => {
    it('says which side has no price, and cannot judge value loss', () => {
      const unpricedInput = route([swap(asset('ETH', null), asset('BSC', 1))], {
        outputAmount: '1',
      });
      const unpricedOutput = route(
        [swap(asset('ETH', 1000), asset('BSC', null))],
        { outputAmount: '1' }
      );

      expect(warningsOf(unpricedInput)).toMatchObject({
        unknownPrice: { input: true, output: false },
        highValueLoss: null,
      });
      expect(warningsOf(unpricedOutput)).toMatchObject({
        unknownPrice: { input: false, output: true },
        highValueLoss: null,
      });
    });

    it('is not set when both sides are priced', () => {
      expect(warningsOf(valued(1000, 1000)).unknownPrice).toBeNull();
    });
  });

  describe('outputChange', () => {
    const pickedOutput = (outputAmount: string) =>
      quote([swap(asset('ETH', 1000), asset('BSC', 1))], outputAmount);

    it('flags a drop of a hundredth from the picked quote on an input worth a thousand', () => {
      const result = warnings({
        quote: pickedOutput('1000'),
        route: valued(1000, 985),
        slippage: '1',
      });

      expect(result.outputChange).toEqual({
        percentageChange: -1.5,
        usdChange: '-15',
      });
    });

    it('needs a drop of a fiftieth on an input worth a few hundred dollars', () => {
      const picked = quote([swap(asset('ETH', 600), asset('BSC', 1))], '600');

      expect(
        warnings({
          quote: picked,
          route: valued(600, 591),
          slippage: '1',
        }).outputChange
      ).toBeNull();
      expect(
        warnings({
          quote: picked,
          route: valued(600, 585),
          slippage: '1',
        }).outputChange
      ).toMatchObject({ percentageChange: -2.5 });
    });

    it('is set alongside a high value loss', () => {
      const result = warnings({
        quote: pickedOutput('1000'),
        route: valued(1000, 850),
        slippage: '1',
      });

      expect(result.highValueLoss).toMatchObject({ priceImpact: -15 });
      expect(result.outputChange).toMatchObject({ percentageChange: -15 });
    });

    it('needs a priced output on the picked quote', () => {
      const unpriced = quote([swap(asset('ETH', 1000), asset('BSC', null))]);

      expect(
        warnings({
          quote: unpriced,
          route: valued(1000, 500),
          slippage: '1',
        }).outputChange
      ).toBeNull();
    });
  });

  describe('slippage', () => {
    const recommending = (...slippages: string[]) =>
      route(
        slippages.map((slippage) =>
          swap(asset('ETH'), asset('BSC'), {
            recommendedSlippage: { error: false, slippage },
          })
        )
      );

    it('flags a slippage below what a step recommends, naming those steps', () => {
      expect(warningsOf(recommending('1', '3'), '2')).toMatchObject({
        insufficientSlippage: {
          recommendedSlippages: { 1: '3' },
          minRequiredSlippage: '3',
        },
        highSlippage: null,
      });
    });

    it('flags a slippage above five percent', () => {
      expect(warningsOf(recommending(), '6')).toMatchObject({
        insufficientSlippage: null,
        highSlippage: { slippage: '6' },
      });
      expect(warningsOf(recommending(), '5')).toMatchObject(
        NO_SLIPPAGE_WARNINGS
      );
    });

    it('accepts a high slippage a step asked for', () => {
      expect(warningsOf(recommending('6'), '6')).toMatchObject(
        NO_SLIPPAGE_WARNINGS
      );
    });

    it('never calls a slippage both too low and too high', () => {
      expect(warningsOf(recommending('8'), '6')).toMatchObject({
        insufficientSlippage: { minRequiredSlippage: '8' },
        highSlippage: null,
      });
    });
  });
});
