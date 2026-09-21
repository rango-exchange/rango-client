import type {
  ConfirmedRoute,
  ConfirmQuoteIssue,
  ConfirmQuoteParams,
  ConfirmQuoteResult,
  ConfirmQuoteWarnings,
} from './types';
import type { SdkMeta } from '../execution/context';
import type {
  ConfirmRouteRequest,
  ConfirmRouteResponse,
  RangoClient,
  RequestOptions,
} from 'rango-sdk';

import { errorMessage } from '../errors';
import { createExecution } from '../execution/create';

import { getBalanceShortfalls } from './balance';
import { CONFIRM_RETRY_DELAY_MS } from './constants';
import { findMissingWallets, findRouteIssue, toConfirmError } from './validate';
import { toAddressMap, toSwapWallets } from './wallets';
import { getQuoteWarnings } from './warnings';

/** What `confirm` needs from the client: the HTTP client, and meta to price fees. */
export type ConfirmContext = {
  httpClient: RangoClient;
  getMeta: () => SdkMeta;
};

/**
 * Re-quotes the route the user picked with their wallets, checks that it can
 * run, and builds the execution to start. Nothing is sent while a chain the
 * route touches has no wallet. A call that failed is tried once more, unless
 * the host aborted it.
 */
export async function confirmQuote(
  context: ConfirmContext,
  params: ConfirmQuoteParams,
  options?: RequestOptions
): Promise<ConfirmQuoteResult> {
  const { quote, selectedWallets, destination } = params;
  const hasDestination = !!destination;

  const missingWallets = findMissingWallets(
    quote.swaps,
    selectedWallets,
    hasDestination
  );
  if (missingWallets) {
    return fail(missingWallets);
  }

  const requested = await requestRoute(
    context.httpClient,
    {
      requestId: quote.requestId,
      selectedWallets: toAddressMap(selectedWallets),
      destination,
    },
    options
  );
  if ('issue' in requested) {
    return fail(requested.issue);
  }
  const { route } = requested;
  const swaps = route.result?.swaps ?? [];

  // The confirmed route can differ from the picked one, so its chains are checked too.
  const issue =
    findRouteIssue(route) ??
    findMissingWallets(swaps, selectedWallets, hasDestination);
  if (issue) {
    return fail(issue);
  }

  const balanceShortfalls = getBalanceShortfalls({
    swaps,
    validationStatus: route.validationStatus,
    selectedWallets,
  });
  const warnings: ConfirmQuoteWarnings = {
    ...getQuoteWarnings({
      quote,
      route,
      slippage: params.settings.slippage,
      meta: context.getMeta(),
    }),
    balance: balanceShortfalls.length
      ? { shortfalls: balanceShortfalls }
      : null,
  };

  const execution = createExecution({
    route,
    wallets: toSwapWallets(selectedWallets),
    settings: params.settings,
    // A shortfall the user chose to proceed with must not fail the swap at execution time.
    validateBalanceOrFee: !warnings.balance,
    mode: params.swapMode,
  });

  return { ok: true, route, execution, warnings };
}

function fail(issue: ConfirmQuoteIssue): ConfirmQuoteResult {
  return { ok: false, error: toConfirmError(issue) };
}

/** Calls the confirm endpoint and turns whatever went wrong into an issue. */
async function requestRoute(
  httpClient: RangoClient,
  body: ConfirmRouteRequest,
  options?: RequestOptions
): Promise<{ route: ConfirmedRoute } | { issue: ConfirmQuoteIssue }> {
  const signal = options?.signal;

  let response: ConfirmRouteResponse;
  try {
    response = await withOneRetry(
      async () => httpClient.confirmRoute(body, options),
      signal
    );
  } catch (error) {
    if (isCanceled(error, signal)) {
      return { issue: { type: 'request_canceled' } };
    }
    return {
      issue: { type: 'request_failed', detail: describeRequestError(error) },
    };
  }

  if (!response.result) {
    return { issue: { type: 'request_failed', detail: response.error } };
  }
  return { route: response.result };
}

/**
 * Runs the request once more after a short wait when it threw, unless the
 * host aborted it. An abort during the wait rethrows the first error, which
 * the caller then reports as canceled.
 */
async function withOneRetry<T>(
  request: () => Promise<T>,
  signal: RequestOptions['signal']
): Promise<T> {
  try {
    return await request();
  } catch (error) {
    if (isCanceled(error, signal)) {
      throw error;
    }
    await delay(CONFIRM_RETRY_DELAY_MS);
    if (signal?.aborted) {
      throw error;
    }
    return request();
  }
}

/** Axios reports an aborted request with the `ERR_CANCELED` code. */
function isCanceled(error: unknown, signal: RequestOptions['signal']): boolean {
  return (
    !!signal?.aborted ||
    (error as { code?: unknown } | null)?.code === 'ERR_CANCELED'
  );
}

/** The API's error text when the response carried one, else the failure's message. */
function describeRequestError(error: unknown): string | null {
  const apiError = (
    error as { response?: { data?: { error?: unknown } } } | null
  )?.response?.data?.error;
  return typeof apiError === 'string' ? apiError : errorMessage(error);
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
