import type { SwapQueueContext, SwapStorage } from '../../types';
import type { NextTransactionStateError } from '../common/produceNextStateForTransaction';
import type { ExecuterActions } from '@rango-dev/queue-manager-core';
import type { TrustSet, TxResponse } from 'xrpl';

import {
  isXrplChangeTrustLinePrerequisiteResult,
  XRPL_CHANGE_TRUSTLINE_TYPE,
  type XrplChangeTrustLinePrerequisiteResult,
} from 'rango-types';
import { Err } from 'ts-results';
import { Client } from 'xrpl';

import {
  delay,
  getCurrentStep,
  updateStorageWithPrerequisiteResult,
} from '../../helpers';
import { SwapActionTypes } from '../../types';
import { onNextStateError } from '../common/produceNextStateForTransaction';

import {
  INTERVAL_FOR_CHECK_XRPL_TRUSTLINE_TRANSACTION_STATUS,
  XRPL_PUBLIC_SERVER,
} from './constants';

export async function checkXrplTrustLineTransactionStatus(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
): Promise<void> {
  const { failed, getStorage, retry, next, schedule } = actions;

  const swap = getStorage().swapDetails;
  const currentStep = getCurrentStep(swap)!;

  const onFinish = () => {
    if (actions.context.resetClaimedBy) {
      actions.context.resetClaimedBy();
    }
  };

  const onSuccessfulFinish = () => {
    schedule(SwapActionTypes.CHECK_PREREQUISITES);
    next();
    onFinish();
  };

  const handleErr = (err: Err<NextTransactionStateError>) => {
    onNextStateError(actions, err.val);
    failed();
    onFinish();
  };

  const retryAfterDelay = async () => {
    await delay(INTERVAL_FOR_CHECK_XRPL_TRUSTLINE_TRANSACTION_STATUS);
    retry();
  };

  /*
   *
   * 1. Ensure a pending XRPL_CHANGE_TRUSTLINE prerequisite result is available.
   *
   */
  let pendingXrplChangeTrustLinePrerequisiteResult: XrplChangeTrustLinePrerequisiteResult | null =
    null;

  for (const prerequisiteResult of currentStep.prerequisiteResults) {
    if (
      isXrplChangeTrustLinePrerequisiteResult(prerequisiteResult) &&
      prerequisiteResult.status === 'pending'
    ) {
      pendingXrplChangeTrustLinePrerequisiteResult = prerequisiteResult;
      break;
    }
  }

  if (!pendingXrplChangeTrustLinePrerequisiteResult) {
    onSuccessfulFinish();
    return;
  }

  try {
    const client = new Client(XRPL_PUBLIC_SERVER);
    await client.connect();

    const response: TxResponse<TrustSet> = await client.request({
      command: 'tx',
      transaction:
        pendingXrplChangeTrustLinePrerequisiteResult.data
          .executedTransactionHash,
    });

    if (!response.result.validated) {
      // If data is not final, we need to retry
      await retryAfterDelay();
      return;
    }

    // If data is final, we can update the prerequisite status
    if (
      typeof response.result.meta !== 'string' && // `response.result.meta` should not be of type "string" because `binary` filed is not set in tx request
      response.result.meta?.TransactionResult === 'tesSUCCESS' // https://xrpl.org/docs/references/protocol/transactions/transaction-results
    ) {
      const prerequisiteResult: XrplChangeTrustLinePrerequisiteResult = {
        prerequisiteIndex:
          pendingXrplChangeTrustLinePrerequisiteResult.prerequisiteIndex,
        prerequisiteType: XRPL_CHANGE_TRUSTLINE_TYPE,
        status: 'success',
        data: {
          executedTransactionHash:
            pendingXrplChangeTrustLinePrerequisiteResult.data
              .executedTransactionHash,
        },
      };

      updateStorageWithPrerequisiteResult(actions, prerequisiteResult);
      onSuccessfulFinish();
    } else {
      const prerequisiteResult: XrplChangeTrustLinePrerequisiteResult = {
        prerequisiteIndex:
          pendingXrplChangeTrustLinePrerequisiteResult.prerequisiteIndex,
        prerequisiteType: XRPL_CHANGE_TRUSTLINE_TYPE,
        status: 'failed',
        data: {
          executedTransactionHash:
            pendingXrplChangeTrustLinePrerequisiteResult.data
              .executedTransactionHash,
        },
      };

      updateStorageWithPrerequisiteResult(actions, prerequisiteResult);
      handleErr(
        new Err({
          nextStatus: 'failed',
          nextStepStatus: 'failed',
          message:
            'Unexpected Error: xrpl change trustline transaction failed!',
          details: undefined,
          errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
        })
      );
    }
  } catch {
    await retryAfterDelay();
  }
}
