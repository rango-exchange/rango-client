import type { RangoError } from 'rango-types';

import { error as logError } from '@rango-dev/logging-core';

import { errorMessages } from '../constants/errors';

export function logRangoError(rangoError: RangoError): void {
  logError(rangoError, {
    tags: rangoError.getErrorTags(),
    context: rangoError.getErrorContext(),
  });
}

/*
 * A failed `import()` has no standard error, so each engine and bundler words
 * it differently. Lowercase, they are matched against a lowercased message.
 */
const MODULE_LOAD_ERROR_MESSAGES = [
  // Chromium
  'failed to fetch dynamically imported module',
  // Firefox
  'error loading dynamically imported module',
  // Safari
  'importing a module script failed',
  // A stale chunk answered with the index page instead of a module
  'failed to load module script',
  // Vite
  'unable to preload css',
  // Webpack
  'loading chunk',
  'loading css chunk',
  'chunkloaderror',
];

const MAX_CAUSE_DEPTH = 5;

function toMessage(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (value instanceof Error) {
    // Webpack names its failures rather than wording them.
    return `${value.name} ${value.message}`;
  }

  return '';
}

export function isModuleLoadError(value: unknown): boolean {
  /*
   * A connection failure carries the wallet's own error as its cause, so a
   * failed import can sit a few causes down.
   */
  let current = value;
  for (let depth = 0; depth < MAX_CAUSE_DEPTH; depth++) {
    const message = toMessage(current).toLowerCase();
    if (
      message &&
      MODULE_LOAD_ERROR_MESSAGES.some((candidate) =>
        message.includes(candidate)
      )
    ) {
      return true;
    }

    if (!(current instanceof Error)) {
      return false;
    }
    current = current.cause;
  }

  return false;
}

/**
 * Replace a failure we recognize with one worth showing to a user.
 *
 * Every place the widget calls into another package routes its failures through
 * here, so a new class of failure only has to be taught to the widget once.
 *
 * @param error - a thrown error, or a message already stringified from one.
 * @returns a user facing error keeping the original as `cause`, or `null` when
 * the failure is not one we recognize.
 */
export function tryRefineError(error: unknown): Error | null {
  if (isModuleLoadError(error)) {
    return new Error(errorMessages().moduleLoadError, { cause: error });
  }

  return null;
}

export function tryRefineErrorMessage(
  error: unknown,
  fallback: string
): string {
  return tryRefineError(error)?.message ?? fallback;
}
