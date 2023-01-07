import { QueueDef } from "@rangodev/queue-manager-core";
import { GenericTransactionType } from "@rangodev/wallets-shared";
import {
  BlockReason,
  SwapActionTypes,
  SwapQueueContext,
  SwapStorage,
} from "./types";
import { checkStatus } from "./actions/checkStatus";
import { createTransaction } from "./actions/createTransaction";
import { executeTransaction } from "./actions/executeTransaction";
import { scheduleNextStep } from "./actions/scheduleNextStep";
import { start } from "./actions/start";
import {
  getCurrentStep,
  onBlockForChangeNetwork,
  onBlockForConnectWallet,
  onDependsOnOtherQueues,
} from "./helpers";
import { PendingSwapNetworkStatus } from "../rango/types";

export type SwapQueueDef = QueueDef<
  SwapStorage,
  SwapActionTypes,
  SwapQueueContext
>;
export const swapQueueDef: SwapQueueDef = {
  name: "rango-swap",
  actions: {
    [SwapActionTypes.START]: start,
    [SwapActionTypes.SCHEDULE_NEXT_STEP]: scheduleNextStep,
    [SwapActionTypes.CREATE_TRANSACTION]: createTransaction,
    [SwapActionTypes.EXECUTE_TRANSACTION]: executeTransaction,
    [SwapActionTypes.CHECK_TRANSACTION_STATUS]: checkStatus,
  },
  run: [SwapActionTypes.START],
  whenTaskBlocked: (event, meta) => {
    const { queue, context, getBlockedTasks } = meta;
    console.log("[whenTaskBlocked]", {
      reason: event.reason.reason,
      queue,
      event,
      blocked: getBlockedTasks(),
    });

    if (event.reason.reason === BlockReason.WAIT_FOR_CONNECT_WALLET) {
      onBlockForConnectWallet(event, queue, context);
    } else if (event.reason.reason === BlockReason.WAIT_FOR_NETWORK_CHANGE) {
      onBlockForChangeNetwork(event, queue, context);
    } else if (event.reason.reason === BlockReason.DEPENDS_ON_OTHER_QUEUES) {
      onDependsOnOtherQueues(event, meta);
    }
  },
};
