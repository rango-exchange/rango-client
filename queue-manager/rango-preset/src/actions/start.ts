import { ExecuterActions } from '@yeager-dev/queue-manager-core';
import { StepEventType, SwapActionTypes, SwapStorage } from '../types';
import { notifier } from '../services/eventEmitter';

export function start({
  schedule,
  next,
  getStorage,
}: ExecuterActions<SwapStorage, SwapActionTypes>): void {
  const swap = getStorage().swapDetails;

  notifier({ event: { type: StepEventType.STARTED }, swap, step: null });

  schedule(SwapActionTypes.SCHEDULE_NEXT_STEP);
  next();
}
