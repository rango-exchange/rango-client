import type { StepBlock } from './execution/types';
import type { APIErrorCode, SignerErrorCode } from 'rango-types';

export class RangoSdkError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message);

    this.name = 'RangoSdkError';
    this.cause = cause;
  }
}

/**
 * Thrown inside an action when the swap has to stop with a known code. The
 * action that runs the work catches it and turns it into a `failed`
 * transition, so it never reaches the engine.
 */
export class ActionError extends RangoSdkError {
  readonly code: APIErrorCode | SignerErrorCode;

  constructor(
    code: APIErrorCode | SignerErrorCode,
    message: string,
    cause?: unknown
  ) {
    super(message, cause);

    this.name = 'ActionError';
    this.code = code;
  }
}

/**
 * Thrown inside an action when the step cannot go on until something outside
 * the engine changes: a wallet connects, or switches account or network. The
 * action that runs the work catches it and turns it into a `blocked`
 * transition, so the loop parks the step instead of failing the swap.
 */
export class ActionBlockedError extends RangoSdkError {
  readonly block: StepBlock;

  constructor(block: StepBlock, cause?: unknown) {
    super(`Step blocked: ${block.reason}`, cause);

    this.name = 'ActionBlockedError';
    this.block = block;
  }
}

/** The text of an error, whatever was thrown. For diagnostics only. */
export function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
