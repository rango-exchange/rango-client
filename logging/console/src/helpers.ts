import type { EventPayload } from '@arlert-dev/logging-types';

import { Level } from '@arlert-dev/logging-types';

export function levelToName(level: Level) {
  switch (level) {
    case Level.Trace:
      return 'trace';
    case Level.Debug:
      return 'debug';
    case Level.Info:
      return 'info';
    case Level.Warn:
      return 'warn';
    case Level.Error:
      return 'error';
    case Level.Off:
      return 'off';
    default:
      return `unknown level (${level})`;
  }
}

export function levelToConsoleStyle(level: Level) {
  switch (level) {
    case Level.Trace:
      return 'background-color: #87d9ff; color: #000000;';
    case Level.Debug:
      return 'background-color: #4fff00; color: #000000;';
    case Level.Info:
      return 'background-color: #ffd800; color: #000000;';
    case Level.Warn:
      return 'background-color: #0034ff; color: #000000;';
    case Level.Error:
      return 'background-color: #ff0000;';
    case Level.Off:
      return 'background-color: #000000;';
    default:
      return 'background-color: #cccccc;';
  }
}

export function formatMessage(payload: EventPayload) {
  return [
    `%c[%s] %O %O`,
    levelToConsoleStyle(payload.level),
    levelToName(payload.level),
    payload.message,
    payload.data,
  ];
}
