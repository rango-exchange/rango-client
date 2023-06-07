import type { SignerError as SignerErrorType } from 'rango-types';
import { SignerError, SignerErrorCode } from 'rango-types';

export const cleanEvmError = (error: any): SignerErrorType => {
  let message = undefined;
  if (
    error &&
    Object.prototype.hasOwnProperty.call(error, 'message') &&
    Object.prototype.hasOwnProperty.call(error, 'code') &&
    Object.prototype.hasOwnProperty.call(error, 'reason')
  ) {
    message = `Error sending the tx (code: ${(error as any).code})`;
  } else if (
    error &&
    Object.prototype.hasOwnProperty.call(error, 'code') &&
    Object.prototype.hasOwnProperty.call(error, 'message') &&
    (error as any)?.code === -32603
  ) {
    return new SignerError(
      SignerErrorCode.SEND_TX_ERROR,
      undefined,
      (error as any).message
    );
  }
  return new SignerError(SignerErrorCode.SEND_TX_ERROR, message, error);
};
