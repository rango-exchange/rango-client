import type { EventPayload, Level } from '@arlert-dev/logging-types';

export function isEnabled(baseLevel: Level, level: Level) {
  return level >= baseLevel;
}

export function isValidEvent(payload: EventPayload) {
  if (!payload.level || !payload.message) {
    return false;
  }
  return true;
}
