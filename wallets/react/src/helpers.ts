import type { ProviderContext } from './index.js';

import { debug } from '@rango-dev/logging-core';

function logError(method: string, args: unknown[], error: unknown) {
  const err = error instanceof Error ? error : new Error(String(error));
  debug(err, {
    context: { method, args },
    tags: { type: 'wallet-error' },
  });
}

function withErrorLogging<TArgs extends unknown[], TReturn>(
  method: string,
  fn: (...args: TArgs) => TReturn
): (...args: TArgs) => TReturn {
  return (...args: TArgs): TReturn => {
    try {
      const result = fn(...args);
      // Async method: catch the rejection, log, then throw the rejection.
      if (result instanceof Promise) {
        return result.catch((error: unknown) => {
          logError(method, args, error);
          throw error;
        }) as TReturn;
      }
      return result;
    } catch (error) {
      // Sync method: log and rethrow.
      logError(method, args, error);
      throw error;
    }
  };
}

export function withErrorLoggingApi(api: ProviderContext): ProviderContext {
  const entries = Object.entries(api).map(([key, value]) => [
    key,
    withErrorLogging(key, (value as (...args: unknown[]) => unknown).bind(api)),
  ]);

  return Object.fromEntries(entries) as ProviderContext;
}
