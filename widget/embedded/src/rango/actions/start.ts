import { ActionParams, SwapActionTypes } from '../types';

export function start({ schedule, next }: ActionParams): void {
  schedule(SwapActionTypes.SCHEDULE_NEXT_STEP);
  next();
}
