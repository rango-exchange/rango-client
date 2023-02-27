import { ExecuterActions } from '@rango-dev/queue-manager-core';
import { SwapActionTypes, SwapStorage } from '../types';

export function start({ schedule, next }: ExecuterActions<SwapStorage, SwapActionTypes>) {
  console.log('%cswap started...', 'color:#5fa425; background:white; font-size: 1.5rem');

  schedule(SwapActionTypes.SCHEDULE_NEXT_STEP);
  next();
}
