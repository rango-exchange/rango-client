import type { SwapQueueDef } from './types';

import { checkPrerequisites } from './actions/checkPrerequisites';
import { checkStatus } from './actions/checkStatus';
import { checkStellarTrustline } from './actions/checkStellarTrustline';
import { checkXrplTrustline } from './actions/checkXrplTrustline';
import { checkXrplTrustLineTransactionStatus } from './actions/checkXrplTrustlineTransactionStatus';
import { createTransaction } from './actions/createTransaction';
import { executeStellarTransaction } from './actions/executeStellarTransaction';
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
    [SwapActionTypes.CHECK_PREREQUISITES]: checkPrerequisites,
    [SwapActionTypes.CHECK_XRPL_TRUSTLINE]: checkXrplTrustline,
    [SwapActionTypes.CHECK_XRPL_TRUSTLINE_TRANSACTION_STATUS]:
      checkXrplTrustLineTransactionStatus,
    [SwapActionTypes.CHECK_STELLAR_TRUSTLINE]: checkStellarTrustline,
    [SwapActionTypes.EXECUTE_TRANSACTION]: executeTransaction,
    [SwapActionTypes.EXECUTE_XRPL_TRANSACTION]: executeXrplTransaction,
    [SwapActionTypes.EXECUTE_STELLAR_TRANSACTION]: executeStellarTransaction,
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
