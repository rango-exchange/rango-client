import type { SwapExecution, SwapExecutionStep, SwapWallet } from './types';
import type { ConfirmedRoute } from '../confirmation/types';
import type { SwapSavedSettings } from 'rango-types';

import { RangoSdkError } from '../errors';

export type CreateExecutionParams = {
  route: ConfirmedRoute;
  /** The wallet picked for each chain the route touches, keyed by chain. */
  wallets: Record<string, SwapWallet>;
  settings: SwapSavedSettings;
  /** `false` when the user chose to start a swap the API said they were short for. */
  validateBalanceOrFee: boolean;
  /** Defaults to `'swap'`. */
  mode?: SwapExecution['mode'];
};

/**
 * Builds the record the engine stores for a confirmed route, before anything
 * has run: `version` 0, `status` `'running'`, and one `pending` step per swap
 * of the route with nothing produced yet. It is pure; the caller hands the
 * result to `Engine.execute` to start it.
 *
 * Throws when the route has no swaps to run. `confirm` rejects such a route
 * before getting here, so this only guards against a caller skipping it.
 */
export function createExecution(params: CreateExecutionParams): SwapExecution {
  const {
    route,
    wallets,
    settings,
    validateBalanceOrFee,
    mode = 'swap',
  } = params;

  const swaps = route.result?.swaps;
  if (!swaps?.length) {
    throw new RangoSdkError(
      'Cannot create an execution for a route with no swaps',
      route
    );
  }

  return {
    requestId: route.requestId,
    version: 0,
    createdAt: Date.now(),
    finishedAt: null,
    status: 'running',
    failure: null,
    wallets,
    settings,
    mode,
    validateBalanceOrFee,
    route,
    steps: swaps.map(() => createStep()),
  };
}

function createStep(): SwapExecutionStep {
  return {
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
  };
}
