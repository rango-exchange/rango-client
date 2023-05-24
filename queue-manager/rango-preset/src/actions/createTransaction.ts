import { ExecuterActions } from '@rango-dev/queue-manager-core';
import { SwapActionTypes, SwapQueueContext, SwapStorage } from '../types';
import {
  getCurrentStep,
  updateSwapStatus,
  throwOnOK,
  getCurrentStepTx,
  setCurrentStepTx,
} from '../helpers';
import { prettifyErrorMessage } from '../shared-errors';
import { CreateTransactionRequest } from 'rango-sdk';
import { httpService } from '../services';

/**
 *
 * When a user asks for a swap, We first create the transaction by sending a request to server
 * Server will return the transaction that need to be sent to wallet.
 * It can be failed if server goes through an error, If not, we will schedule the `EXECTUTE_TRANSACTION`.
 *
 */
export async function createTransaction(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
): Promise<void> {
  const { setStorage, getStorage, next, schedule, context } = actions;
  const swap = getStorage().swapDetails;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentStep = getCurrentStep(swap)!;
  const transaction = getCurrentStepTx(currentStep);

  if (!transaction) {
    const request: CreateTransactionRequest = {
      requestId: swap.requestId,
      step: currentStep.id,
      userSettings: {
        slippage: swap.settings.slippage,
        infiniteApprove: swap.settings.infiniteApprove,
      },
      validations: {
        balance: swap.validateBalanceOrFee,
        fee: swap.validateBalanceOrFee,
      },
    };
    try {
      // Getting transcation from server.

      const { transaction } = await throwOnOK(
        httpService().createTransaction(request)
      );

      if (transaction) setCurrentStepTx(currentStep, transaction);

      setStorage({ ...getStorage(), swapDetails: swap });
      schedule(SwapActionTypes.EXECUTE_TRANSACTION);
      next();
    } catch (error) {
      swap.status = 'failed';
      swap.finishTime = new Date().getTime().toString();
      const { extraMessage, extraMessageDetail } = prettifyErrorMessage(error);

      const updateResult = updateSwapStatus({
        getStorage,
        setStorage,
        nextStatus: 'failed',
        nextStepStatus: 'failed',
        message: extraMessage,
        details: extraMessageDetail,
        errorCode: 'FETCH_TX_FAILED',
      });
      context.notifier({
        eventType: 'task_failed',
        ...updateResult,
      });

      actions.failed();
    }
  }
}
