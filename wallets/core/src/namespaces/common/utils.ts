/**
 * Standardizes an unknown error into an Error object and throws it.
 * If the input is already an Error, it's thrown directly.
 * Otherwise, a new Error is created with the input's message or string representation.
 *
 * @param e - The unknown error object.
 * @throws {Error} - The standardized Error object.
 */
export function parseErrorAndThrowStandardizeError(e: unknown): never {
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

  const err = new Error(errorMessage) as Error & {
    code?: unknown;
    data?: unknown;
  };

  if (typeof e === 'object' && e !== null) {
    if ('code' in e) {
      err.code = e.code;
    }
    if ('data' in e) {
      err.data = e.data;
    }
  }

  throw err;
}
