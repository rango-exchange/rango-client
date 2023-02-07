import { SwapActionTypes, SwapQueueDef } from './types';
import { start } from './actions/start';

export const swapQueueDef: SwapQueueDef = {
  name: 'swap',
  actions: {
    [SwapActionTypes.START]: start,
    [SwapActionTypes.SCHEDULE_NEXT_STEP]: start,
    [SwapActionTypes.CREATE_TRANSACTION]: start,
    [SwapActionTypes.CHECK_TRANSACTION_STATUS]: start,
    [SwapActionTypes.EXECUTE_TRANSACTION]: start,
  },
  run: [SwapActionTypes.START],
  whenTaskBlocked: () => {},
};
