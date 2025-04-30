import type { Context } from '../../hub/namespaces/mod.js';

/**
 * Standardizes an unknown error into an Error object and throws it.
 * If the input is already an Error, it's thrown directly.
 * Otherwise, a new Error is created with the input's message or string representation.
 *
 * @param context - The context.
 * @param e - The unknown error object.
 * @throws {Error} - The standardized Error object.
 */
export function standardizeAndThrowError(context: Context, e: unknown): never {
  if (e instanceof Error) {
    throw e;
  }

  let errorMessage: string;
  if (
    typeof e === 'object' &&
    e !== null &&
    'message' in e &&
    typeof e.message === 'string'
  ) {
    errorMessage = e.message;
  } else if (typeof e === 'string') {
    errorMessage = e;
  } else {
    errorMessage = String(e);
  }

  throw new Error(errorMessage);
}
