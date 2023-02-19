import { ExecuterActions } from '@rangodev/queue-manager-core';
import { SwapActionTypes, SwapQueueContext, SwapStorage } from '../types';
import {
  getCurrentStep,
  isCosmosTransaction,
  isEvmTransaction,
  isSolanaTransaction,
  isTrasnferTransaction,
  // updateSwapStatus,
} from '../helpers';

/**
 *
 * When a user asks for a swap, We first create the transaction by sending a request to server
 * Server will return the transaction that need to be sent to wallet.
 * It can be failed if server goes through an error, If not, we will schedule the `EXECTUTE_TRANSACTION`.
 *
 */
export async function createTransaction(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>,
): Promise<void> {
  const { setStorage, getStorage, next, schedule, context } = actions;
  const swap = getStorage().swapDetails;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentStep = getCurrentStep(swap)!;

  const {
    evmTransaction,
    cosmosTransaction,
    transferTransaction,
    evmApprovalTransaction,
    solanaTransaction,
  } = currentStep;

  if (
    !evmTransaction &&
    !cosmosTransaction &&
    !transferTransaction &&
    !evmApprovalTransaction &&
    !solanaTransaction
  ) {
    const request: CreateTransactionRequest = {
      requestId: swap.requestId,
      step: currentStep.id,
      userSettings: { slippage: swap.settings.slippage },
      validations: {
        balance: swap.validateBalanceOrFee,
        fee: swap.validateBalanceOrFee,
      },
    };
    try {
      // Getting transcation from server.
      const { transaction } = await requestTransaction(request);

      if (isEvmTransaction(transaction)) {
        if (transaction.isApprovalTx) currentStep.evmApprovalTransaction = transaction;
        else currentStep.evmTransaction = transaction;
      } else if (isCosmosTransaction(transaction)) {
        currentStep.cosmosTransaction = transaction;
      } else if (isSolanaTransaction(transaction)) {
        currentStep.solanaTransaction = transaction;
      } else if (isTrasnferTransaction(transaction)) {
        currentStep.transferTransaction = transaction;
      }

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
      });
      // context.notifier({
      //   eventType: 'task_failed',
      //   ...updateResult,
      // });

      actions.failed();
    }
  }
}
