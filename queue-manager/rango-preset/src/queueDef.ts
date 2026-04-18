import type { SwapQueueDef } from './types';

import { checkHyperliquidTransactionStatus } from './actions/checkHyperliquidTransactionStatus';
import { checkStatus } from './actions/checkStatus';
import { checkXrplTrustline } from './actions/checkXrplTrustline';
import { createTransaction } from './actions/createTransaction';
import { executeHyperliquidTransaction } from './actions/executeHyperliquidTransaction';
import { executeTransaction } from './actions/executeTransaction';
import { executeXrplTransaction } from './actions/executeXrplTransaction';
import { scheduleNextStep } from './actions/scheduleNextStep';
import { start } from './actions/start';
import {
  onBlockForChangeNetwork,
  onBlockForConnectWallet,
  onDependsOnOtherQueues,
} from './helpers';
import { BlockReason, SwapActionTypes } from './types';

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
    [SwapActionTypes.EXECUTE_XRPL_TRANSACTION]: executeXrplTransaction,
    [SwapActionTypes.CHECK_XRPL_TRUSTLINE]: checkXrplTrustline,
    [SwapActionTypes.EXECUTE_HYPERLIQUID_TRANSACTION]:
      executeHyperliquidTransaction,
    [SwapActionTypes.CHECK_HYPERLIQUID_TRANSACTION_STATUS]:
      checkHyperliquidTransactionStatus,
    [SwapActionTypes.CHECK_TRANSACTION_STATUS]: checkStatus,
  },
  run: [SwapActionTypes.START],
  whenTaskBlocked: (event, meta) => {
    if (event.reason.reason === BlockReason.WAIT_FOR_CONNECT_WALLET) {
      onBlockForConnectWallet(event, meta);
    } else if (event.reason.reason === BlockReason.WAIT_FOR_NETWORK_CHANGE) {
      onBlockForChangeNetwork(event, meta);
    } else if (event.reason.reason === BlockReason.DEPENDS_ON_OTHER_QUEUES) {
      onDependsOnOtherQueues(event, meta);
    }
  },
};
