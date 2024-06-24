import type { WidgetEventEmitter } from '../../types';

import { eventEmitter } from '../../services/eventEmitter';

export function useWidgetEvents(): WidgetEventEmitter {
  // To be exported for Dapps
  const { on, off } = eventEmitter;
  return { on, off };
}
