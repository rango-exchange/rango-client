import type { Context } from '../../hub/namespaces/mod.js';

import { parseErrorAndThrowStandardizeError } from './utils.js';

/**
 * Standardizes an unknown error into an Error object and throws it.
 * If the input is already an Error, it's thrown directly.
 * Otherwise, a new Error is created with the input's message or string representation.
 * Note: The parseErrorAndThrowStandardizeError function is defined as a separate function, so that it can be used independently.
 *
 * @param _context - The context.
 * @param e - The unknown error object.
 * @throws {Error} - The standardized Error object.
 */
export function standardizeAndThrowError(_context: Context, e: unknown): never {
  parseErrorAndThrowStandardizeError(e);
}
