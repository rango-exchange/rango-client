import type { Data, EventPayload, Message } from '@arlert-dev/logging-types';

import { EventType, Level } from '@arlert-dev/logging-types';

import { isValidInstance } from './helpers';

export function ev(level: Level, message: Message, data?: Data) {
  if (!isValidInstance(message)) {
    throw new Error('Your error input should be an instance of Error.');
  }

  const event = new CustomEvent<EventPayload>(EventType, {
    detail: {
      level,
      message,
      data,
    },
  });

  if (!document) {
    console.warn("document isn't available.");
  } else {
    document.dispatchEvent(event);
  }
}

export function error(message: Message, data?: Data) {
  ev(Level.Error, message, data);
}

export function warn(message: Message, data?: Data) {
  ev(Level.Warn, message, data);
}
export function info(message: Message, data?: Data) {
  ev(Level.Info, message, data);
}

export function debug(message: Message, data?: Data) {
  ev(Level.Debug, message, data);
}

export function trace(message: Message, data?: Data) {
  ev(Level.Trace, message, data);
}
