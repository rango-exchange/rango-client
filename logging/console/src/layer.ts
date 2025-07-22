import type { Layer } from '@arlert-dev/logging-types';

import { Level } from '@arlert-dev/logging-types';

import { formatMessage } from './helpers';

export function layer(): Layer {
  return {
    handler(payload) {
      const message = formatMessage(payload);

      switch (payload.level) {
        case Level.Trace:
          console.debug(...message);
          break;
        case Level.Debug:
          console.debug(...message);
          break;
        case Level.Info:
          console.log(...message);
          break;
        case Level.Warn:
          console.warn(...message);
          break;
        case Level.Error:
          console.error(...message);
          break;
        default:
          console.log(...message);
          break;
      }
    },
  };
}
