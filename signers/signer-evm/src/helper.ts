import type { SignerError as SignerErrorType } from 'rango-types';

import { isError } from 'ethers';
import {
  RPCErrorCode as RangoRPCErrorCode,
  SignerError,
  SignerErrorCode,
} from 'rango-types';

export const cleanEvmError = (error: any): SignerErrorType => {
  if (!error) {
    return new SignerError(SignerErrorCode.SEND_TX_ERROR);
  }

  if (SignerError.isSignerError(error)) {
    return error;
  }

  if (error.code) {
    if (isError(error, 'UNKNOWN_ERROR')) {
      const msg = error.error?.message || error.message;
      return new SignerError(
        SignerErrorCode.SEND_TX_ERROR,
        undefined,
        msg,
        RangoRPCErrorCode.UNKNOWN_ERROR,
        error
      );
    }

    if (isError(error, 'ACTION_REJECTED')) {
      const msg = error.shortMessage.replace('action', `'${error.action}'`);
      return new SignerError(
        SignerErrorCode.SEND_TX_ERROR,
        undefined,
        msg,
        RangoRPCErrorCode.REJECTION,
        error
      );
    }

    const msg = error.shortMessage || error.message;
    return new SignerError(
      SignerErrorCode.SEND_TX_ERROR,
      undefined,
      msg,
      RangoRPCErrorCode.UNKNOWN_ERROR,
      error
    );
  }
  return new SignerError(
    SignerErrorCode.SEND_TX_ERROR,
    undefined,
    error,
    RangoRPCErrorCode.UNKNOWN_ERROR,
    error
  );
};

interface TenderlyResponse {
  error_message: string;
}

export async function getTenderlyError(
  chainId: string | undefined,
  txHash: string
): Promise<string | undefined> {
  if (!chainId || !txHash) {
    return;
  }
  const chainIdInt = parseInt(chainId);
  try {
    const url = `https://api.tenderly.co/api/v1/public-contract/${chainIdInt}/tx/${txHash}`;
    const response = await fetch(url, {
      method: 'GET',
    });
    if (!response.ok) {
      return;
    }
    const data: TenderlyResponse = await response.json();
    return data?.error_message;
  } catch (error) {
    return;
  }
}

export const waitMs = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
