import type { Events, WidgetEventEmitter } from '../types';

import mitt from 'mitt';

export const eventEmitter = mitt<Events>();

// To be exported for Dapps
export const widgetEventEmitter: WidgetEventEmitter = {
  on: eventEmitter.on,
  off: eventEmitter.off,
};
