import { ExecuterActions } from '@rangodev/queue-manager-core';
import { SwapActionTypes, SwapQueueContext, SwapStorage } from '../types';
import { getCurrentStep, isTxAlreadyCreated } from '../helpers';

/**
 *
 * This function is responsibe for scheduling the correct `action` based on `PendingSwap` status.
 * It means `action`s schedule this step to decide what should be the next step/task.
 *
 * It's acts like a `while(true)` and will `break` the loop on certain `action`s like `CHECK_STATUS`.
 *
 *
 */
export function scheduleNextStep({
  schedule,
  next,
  failed,
  setStorage,
  getStorage,
  context,
}: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>): void {
  const swap = getStorage().swapDetails;
  const currentStep = getCurrentStep(swap);
  if (!!currentStep) {
    if (isTxAlreadyCreated(swap, currentStep)) {
      schedule(SwapActionTypes.EXECUTE_TRANSACTION);
      return next();
    }

    if (currentStep?.executedTransactionId) {
      schedule(SwapActionTypes.CHECK_TRANSACTION_STATUS);
      return next();
    }

    swap.status = 'running';

    setStorage({ ...getStorage(), swapDetails: swap });

    schedule(SwapActionTypes.CREATE_TRANSACTION);
    next();
  } else {
    const isFailed = swap.steps.find((step) => step.status === 'failed');
    swap.status = isFailed ? 'failed' : 'success';
    swap.finishTime = new Date().getTime().toString();

    setStorage({
      ...getStorage(),
      swapDetails: swap,
    });

    // context.notifier({
    //   eventType: isFailed ? 'task_failed' : 'task_completed',
    //   swap: swap,
    //   step: null,
    // });

    if (isFailed) failed();
    else next();
  }
}
