import { ExecuterActions } from '@rango-dev/queue-manager-core';
import { SwapActionTypes, SwapStorage } from '../types';
import { notifier } from '../services/eventEmitter';

export function start({
  schedule,
  next,
  getStorage,
}: ExecuterActions<SwapStorage, SwapActionTypes>): void {
  const swap = getStorage().swapDetails;

  notifier({ eventType: 'started', swap, step: null });

  schedule(SwapActionTypes.SCHEDULE_NEXT_STEP);
  next();
}
