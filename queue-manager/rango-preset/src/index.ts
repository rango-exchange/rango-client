import { BlockReason, SwapActionTypes, SwapQueueDef } from './types';
import { checkStatus } from './actions/checkStatus';
import { createTransaction } from './actions/createTransaction';
import { executeTransaction } from './actions/executeTransaction';
import { scheduleNextStep } from './actions/scheduleNextStep';
import { start } from './actions/start';
import {
  onBlockForChangeNetwork,
  onBlockForConnectWallet,
  onDependsOnOtherQueues,
} from './helpers';

/**
 *
 * The idea behind this queue is to be able dynamically add some steps.
 * After running a swap, it can be blocked (like on waiting for switch netwrok)
 *  or waits for something happend (like checking status of a transaction from server)
 *
 */
export const swapQueueDef: SwapQueueDef = {
  name: 'swap',
  actions: {
    [SwapActionTypes.START]: start,
    [SwapActionTypes.SCHEDULE_NEXT_STEP]: scheduleNextStep,
    [SwapActionTypes.CREATE_TRANSACTION]: createTransaction,
    [SwapActionTypes.EXECUTE_TRANSACTION]: executeTransaction,
    [SwapActionTypes.CHECK_TRANSACTION_STATUS]: checkStatus,
  },
  run: [SwapActionTypes.START],
  whenTaskBlocked: (event: any, meta: any) => {
    if (event.reason.reason === BlockReason.WAIT_FOR_CONNECT_WALLET) {
      onBlockForConnectWallet(event, meta);
    } else if (event.reason.reason === BlockReason.WAIT_FOR_NETWORK_CHANGE) {
      onBlockForChangeNetwork(event, meta);
    } else if (event.reason.reason === BlockReason.DEPENDS_ON_OTHER_QUEUES) {
      onDependsOnOtherQueues(event, meta);
    }
  },
};

export { SwapQueueContext, SwapStorage } from './types';
export { PendingSwapWithQueueID } from './shared';

// TODO: This is for our frontend, some of them can be removed.
export {
  updateSwapStatus,
  checkWaitingForNetworkChange,
  getCurrentStep,
  getEvmProvider,
  getRelatedWallet,
  cancelSwap,
} from './helpers';
export { useMigration, useQueueManager } from './hooks';
