import type { SeverityLevel } from '@sentry/browser';

import { Level } from '@arlert-dev/logging-types';

const FALLBACK_LEVEL = 'log';

export function levelToSentryLevels(level: Level): SeverityLevel {
  switch (level) {
    case Level.Trace:
      return 'log';
    case Level.Debug:
      return 'debug';
    case Level.Info:
      return 'info';
    case Level.Warn:
      return 'warning';
    case Level.Error:
      return 'error';
    case Level.Off:
      return FALLBACK_LEVEL;
    default:
      return FALLBACK_LEVEL;
  }
}
