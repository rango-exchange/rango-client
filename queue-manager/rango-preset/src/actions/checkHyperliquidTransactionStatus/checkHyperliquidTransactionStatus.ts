import type {
  SwapActionTypes,
  SwapQueueContext,
  SwapStorage,
} from '../../types';
import type { NextTransactionStateError } from '../common/produceNextStateForTransaction';
import type { ExecuterActions } from '@rango-dev/queue-manager-core';
import type { Err } from 'ts-results';

import { warn } from '@rango-dev/logging-core';

import {
  delay,
  getCurrentStep,
  getCurrentStepTx,
  handleSuccessfulSign,
} from '../../helpers';
import { getCurrentAddressOf } from '../../shared';
import { onNextStateError } from '../common/produceNextStateForTransaction';
import { ensureHyperliquidTransactionIsValid } from '../executeHyperliquidTransaction';

import {
  GetHyperliquidTransactionHashError,
  INTERVAL_FOR_CHECK_HYPERLIQUID_TRANSACTION_STATUS,
} from './constants';
import { getHyperliquidTransactionHash } from './utils';

export async function checkHyperliquidTransactionStatus(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
): Promise<void> {
  const { failed, getStorage, retry } = actions;

  const swap = getStorage().swapDetails;
  const currentStep = getCurrentStep(swap)!;

  const onFinish = () => {
    if (actions.context.resetClaimedBy) {
      actions.context.resetClaimedBy();
    }
  };

  const handleErr = (err: Err<NextTransactionStateError>) => {
    onNextStateError(actions, err.val);
    failed();
    onFinish();
  };

  const currentTransactionFromStorage = getCurrentStepTx(currentStep);
  const walletAddress = getCurrentAddressOf(swap, currentStep);

  const hyperliquidTransactionResult = ensureHyperliquidTransactionIsValid(
    currentTransactionFromStorage
  );
  if (hyperliquidTransactionResult.err) {
    handleErr(hyperliquidTransactionResult);
    return;
  }

  const hyperliquidTransaction = hyperliquidTransactionResult.val;
  const nonce = hyperliquidTransaction.nonce;

  const hyperliquidTransactionHash = await getHyperliquidTransactionHash(
    walletAddress,
    nonce
  );

  if (hyperliquidTransactionHash.err) {
    if (
      hyperliquidTransactionHash.val ===
        GetHyperliquidTransactionHashError.FETCH_ERROR ||
      hyperliquidTransactionHash.val ===
        GetHyperliquidTransactionHashError.RESPONSE_PARSING_ERROR
    ) {
      warn(new Error('check Hyperliquid transaction status Error'), {
        tags: {
          type: 'request-error',
          requestBody: { type: 'userDetails', user: walletAddress, nonce },
          pendingSwap: swap,
        },
      });
    }

    await delay(INTERVAL_FOR_CHECK_HYPERLIQUID_TRANSACTION_STATUS);
    retry();
    return;
  }

  handleSuccessfulSign(actions, {
    isApproval: false,
  })({
    hash: hyperliquidTransactionHash.val,
  });
  onFinish();
}
