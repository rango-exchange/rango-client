import { QueueStorage, QueueDef, ExecuterActions } from '@rangodev/queue-manager-core';
import { QueueContext } from '@rangodev/queue-manager-core/dist/queue';
import { PendingSwap } from '@rangodev/ui/dist/containers/History/types';

export type SwapQueueDef = QueueDef<SwapStorage, SwapActionTypes, SwapQueueContext>;

export interface SwapStorage extends QueueStorage {
  swapDetails: PendingSwap;
}

export interface SwapQueueContext extends QueueContext {}

export enum SwapActionTypes {
  START = 'START',
  SCHEDULE_NEXT_STEP = 'SCHEDULE_NEXT_STEP',
  CREATE_TRANSACTION = 'CREATE_TRANSACTION',
  EXECUTE_TRANSACTION = 'EXECUTE_TRANSACTION',
  CHECK_TRANSACTION_STATUS = 'CHECK_TRANSACTION_STATUS',
}

export type ActionParams = ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>;
