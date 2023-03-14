import { ExecuterActions } from '@rango-dev/queue-manager-core';
import { SwapActionTypes, SwapStorage } from '../types';

export function start({
  schedule,
  next,
}: ExecuterActions<SwapStorage, SwapActionTypes>): void {
  schedule(SwapActionTypes.SCHEDULE_NEXT_STEP);
  next();
}
