import type { EventPayload, Layer, Level } from '@arlert-dev/logging-types';

import { EventType } from '@arlert-dev/logging-types';

import { isEnabled, isValidEvent } from './helpers';

interface Options {
  baseLevel: Level;
}

export function init(layers: Layer[], options: Options) {
  const { baseLevel } = options;

  document.addEventListener(EventType, function handler(e) {
    // Typescript issue: https://github.com/microsoft/TypeScript/issues/28357
    const event = e as CustomEvent<EventPayload>;

    // Runtime check for making sure event has a valid structure.
    if (!isValidEvent(event.detail)) {
      return;
    }

    const level = event.detail.level;
    if (!isEnabled(baseLevel, level)) {
      // Skipping event.
      return;
    }

    for (const layer of layers) {
      try {
        layer.handler(event.detail);
      } catch {
        break;
      }
    }
  });
}
