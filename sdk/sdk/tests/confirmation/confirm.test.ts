import type {
  ConfirmQuoteParams,
  ConfirmQuoteResult,
} from '../../src/confirmation/types';
import type {
  BlockchainValidationStatus,
  ConfirmRouteResponse,
  RangoClient,
} from 'rango-sdk';
import type { Mock } from 'vitest';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { confirmQuote } from '../../src/confirmation/confirm';
import { CONFIRM_RETRY_DELAY_MS } from '../../src/confirmation/constants';

import { asset, quote, route, swap, wallet } from './fakes';

const ETH = asset('ETH');
const BSC = asset('BSC');
const swaps = [swap(ETH, BSC)];

const params: ConfirmQuoteParams = {
  quote: quote(swaps),
  selectedWallets: [wallet('ETH'), wallet('BSC')],
  settings: { slippage: '1' },
};

function response(
  result: ConfirmRouteResponse['result'],
  error: string | null = null
): ConfirmRouteResponse {
  return { ok: !!result, result, error, errorCode: null, traceId: null };
}

/** A client whose confirm call answers from the list, one entry per call. */
function client(...answers: (ConfirmRouteResponse | Error)[]) {
  const confirmRoute = vi.fn();
  for (const answer of answers) {
    if (answer instanceof Error) {
      confirmRoute.mockRejectedValueOnce(answer);
    } else {
      confirmRoute.mockResolvedValueOnce(answer);
    }
  }
  return { confirmRoute } as unknown as RangoClient & { confirmRoute: Mock };
}

/** What `confirm` needs besides the params: the client, and meta without tokens. */
function context(httpClient: RangoClient) {
  return { httpClient, getMeta: () => ({ blockchains: [] }) };
}

function issueOf(result: ConfirmQuoteResult) {
  if (result.ok) {
    throw new Error('expected confirm to fail');
  }
  return result.error.cause;
}

function canceledError() {
  return Object.assign(new Error('canceled'), { code: 'ERR_CANCELED' });
}

describe('confirmQuote', () => {
  it('confirms the picked quote with the wallets and returns an execution', async () => {
    const httpClient = client(response(route(swaps)));

    const result = await confirmQuote(context(httpClient), params);

    expect(httpClient.confirmRoute).toHaveBeenCalledWith(
      {
        requestId: 'req-1',
        selectedWallets: { ETH: 'eth-address', BSC: 'bsc-address' },
        destination: undefined,
      },
      undefined
    );
    expect(result).toMatchObject({
      ok: true,
      execution: { requestId: 'req-1', validateBalanceOrFee: true },
      warnings: {
        highValueLoss: null,
        outputChange: null,
        unknownPrice: null,
        insufficientSlippage: null,
        highSlippage: null,
        balance: null,
      },
    });
  });

  it('refuses without a call when a chain the route touches has no wallet', async () => {
    const httpClient = client(response(route(swaps)));

    const result = await confirmQuote(context(httpClient), {
      ...params,
      selectedWallets: [wallet('ETH')],
    });

    expect(issueOf(result)).toEqual({
      type: 'missing_wallets',
      chains: ['BSC'],
    });
    expect(httpClient.confirmRoute).not.toHaveBeenCalled();
  });

  it('needs no wallet on the last chain when a custom destination receives the output', async () => {
    const httpClient = client(response(route(swaps)));

    const result = await confirmQuote(context(httpClient), {
      ...params,
      selectedWallets: [wallet('ETH')],
      destination: '0xdestination',
    });

    expect(result.ok).toBe(true);
    expect(httpClient.confirmRoute).toHaveBeenCalledWith(
      expect.objectContaining({ destination: '0xdestination' }),
      undefined
    );
  });

  it('reports an error the API answered with', async () => {
    const httpClient = client(response(null, 'unknown request id'));

    const result = await confirmQuote(context(httpClient), params);

    expect(issueOf(result)).toEqual({
      type: 'request_failed',
      detail: 'unknown request id',
    });
  });

  it('rejects a confirmed route that cannot run', async () => {
    const httpClient = client(
      response(route([], { diagnosisMessages: ['no liquidity'] }))
    );

    const result = await confirmQuote(context(httpClient), params);

    expect(issueOf(result)).toEqual({
      type: 'no_result',
      diagnosisMessage: 'no liquidity',
    });
  });

  it('rejects a confirmed route that touches a chain the picked quote did not', async () => {
    const httpClient = client(response(route(swaps)));

    const result = await confirmQuote(context(httpClient), {
      ...params,
      quote: quote([swap(ETH, ETH)]),
      selectedWallets: [wallet('ETH')],
    });

    expect(issueOf(result)).toEqual({
      type: 'missing_wallets',
      chains: ['BSC'],
    });
  });

  it('lets a short balance through and tells the execution not to re-check it', async () => {
    const shortOnEth: BlockchainValidationStatus = {
      blockchain: 'ETH',
      wallets: [
        {
          address: 'eth-address',
          addressIsValid: true,
          validResult: true,
          requiredAssets: [
            {
              asset: { blockchain: 'ETH', symbol: 'ETH', address: null },
              requiredAmount: { amount: '2', decimals: 18 },
              currentAmount: { amount: '1', decimals: 18 },
              ok: false,
              reason: 'FEE',
            },
          ],
        },
      ],
    };
    const httpClient = client(
      response(route(swaps, { validationStatus: [shortOnEth] }))
    );

    const result = await confirmQuote(context(httpClient), params);

    expect(result).toMatchObject({
      ok: true,
      execution: { validateBalanceOrFee: false },
      warnings: {
        balance: {
          shortfalls: [{ chain: 'ETH', address: 'eth-address', reason: 'FEE' }],
        },
      },
    });
  });

  describe('when the call throws', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('tries once more after a wait', async () => {
      const httpClient = client(new Error('down'), response(route(swaps)));

      const pending = confirmQuote(context(httpClient), params);
      await vi.advanceTimersByTimeAsync(CONFIRM_RETRY_DELAY_MS);

      expect((await pending).ok).toBe(true);
      expect(httpClient.confirmRoute).toHaveBeenCalledTimes(2);
    });

    it('gives up after the retry fails, with the failure text', async () => {
      const httpClient = client(new Error('down'), new Error('still down'));

      const pending = confirmQuote(context(httpClient), params);
      await vi.advanceTimersByTimeAsync(CONFIRM_RETRY_DELAY_MS);

      expect(issueOf(await pending)).toEqual({
        type: 'request_failed',
        detail: 'still down',
      });
      expect(httpClient.confirmRoute).toHaveBeenCalledTimes(2);
    });

    it("prefers the API's own error text when the response carried one", async () => {
      const badRequest = () =>
        Object.assign(new Error('Request failed with status code 400'), {
          response: { data: { error: 'route expired' } },
        });
      const httpClient = client(badRequest(), badRequest());

      const pending = confirmQuote(context(httpClient), params);
      await vi.advanceTimersByTimeAsync(CONFIRM_RETRY_DELAY_MS);

      expect(issueOf(await pending)).toMatchObject({ detail: 'route expired' });
    });

    it('does not retry a request the host aborted', async () => {
      const controller = new AbortController();
      controller.abort();
      const httpClient = client(canceledError());

      const result = await confirmQuote(context(httpClient), params, {
        signal: controller.signal,
      });

      expect(issueOf(result)).toEqual({ type: 'request_canceled' });
      expect(httpClient.confirmRoute).toHaveBeenCalledTimes(1);
    });

    it('recognises a cancel the HTTP client reports on its own', async () => {
      const httpClient = client(canceledError());

      const result = await confirmQuote(context(httpClient), params);

      expect(issueOf(result)).toEqual({ type: 'request_canceled' });
      expect(httpClient.confirmRoute).toHaveBeenCalledTimes(1);
    });

    it('reports an abort during the wait as canceled, without retrying', async () => {
      const controller = new AbortController();
      const httpClient = client(new Error('down'), response(route(swaps)));

      const pending = confirmQuote(context(httpClient), params, {
        signal: controller.signal,
      });
      await vi.advanceTimersByTimeAsync(0);
      controller.abort();
      await vi.advanceTimersByTimeAsync(CONFIRM_RETRY_DELAY_MS);

      expect(issueOf(await pending)).toEqual({ type: 'request_canceled' });
      expect(httpClient.confirmRoute).toHaveBeenCalledTimes(1);
    });
  });
});
