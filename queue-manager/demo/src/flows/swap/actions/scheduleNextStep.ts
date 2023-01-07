import { ExecuterActions } from "@rangodev/queue-manager-core";
import { SwapActionTypes, SwapQueueContext, SwapStorage } from "../types";
import { getCurrentStep, isTxAlreadyCreated } from "../helpers";

export function scheduleNextStep({
  schedule,
  next,
  failed,
  setStorage,
  getStorage,
  context,
}: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>) {
  console.log(
    "%cschedule next step...",
    "color:#5fa425; background:white; font-size: 1.5rem"
  );

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

    swap.status = "running";

    setStorage({ ...getStorage(), swapDetails: swap });

    schedule(SwapActionTypes.CREATE_TRANSACTION);
    next();
  } else {
    const isFailed = swap.steps.find((step) => step.status === "failed");
    swap.status = isFailed ? "failed" : "success";
    swap.finishTime = new Date().getTime().toString();

    setStorage({
      ...getStorage(),
      swapDetails: swap,
    });

    context.notifier({
      eventType: isFailed ? "task_failed" : "task_completed",
      swap: swap,
      step: null,
    });

    if (isFailed) failed();
    else next();
  }
}
