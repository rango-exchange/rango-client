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

interface TenderlyResponse {
  error_message: string;
}

export async function getTenderlyError(
  chainId: string | undefined,
  txHash: string
): Promise<string | undefined> {
  if (!chainId || !txHash) return;
  const chainIdInt = parseInt(chainId);
  try {
    const url = `https://api.tenderly.co/api/v1/public-contract/${chainIdInt}/tx/${txHash}`;
    const response = await fetch(url, {
      method: 'GET',
    });
    if (!response.ok) return;
    const data: TenderlyResponse = await response.json();
    return data?.error_message;
  } catch (error) {
    return;
  }
}
