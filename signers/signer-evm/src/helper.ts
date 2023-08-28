import type { SignerError as SignerErrorType } from 'rango-types';

import { getMessageFromCode } from 'eth-rpc-errors';
import {
  RPCErrorCode as RangoRPCErrorCode,
  SignerError,
  SignerErrorCode,
} from 'rango-types';

import { MetamaskErrorCodes, RPCErrorCode, RPCErrorMessage } from './types';

export const cleanEvmError = (error: any): SignerErrorType => {
  if (!error) {
    return new SignerError(SignerErrorCode.SEND_TX_ERROR);
  }
  if (SignerError.isSignerError(error)) {
    return error;
  }
  const hasMessage = Object.prototype.hasOwnProperty.call(error, 'message');
  const hasCode = Object.prototype.hasOwnProperty.call(error, 'code');
  if (hasMessage && hasCode) {
    const { message: errorMessage, code: errorCode } = error;
    // rejection error
    if (
      RPCErrorCode.ACTION_REJECTED === errorCode ||
      MetamaskErrorCodes.provider.userRejectedRequest === errorCode
    ) {
      return new SignerError(
        SignerErrorCode.REJECTED_BY_USER,
        undefined,
        error,
        RangoRPCErrorCode.REJECTION,
        error
      );
    }
    if (typeof errorCode === 'number') {
      // provider errors
      if (Object.values(MetamaskErrorCodes.provider).includes(errorCode)) {
        const msg = getMessageFromCode(errorCode);
        return new SignerError(
          SignerErrorCode.SEND_TX_ERROR,
          undefined,
          msg,
          RangoRPCErrorCode.UNKNOWN_ERROR,
          error
        );
      }
      // rpc errors
      else if (Object.values(MetamaskErrorCodes.rpc).includes(errorCode)) {
        // underpriced errors are sent as internal errors
        if (
          errorCode === MetamaskErrorCodes.rpc.internal &&
          (errorMessage?.includes(RPCErrorMessage.UNDER_PRICED) ||
            errorMessage?.includes(RPCErrorMessage.REPLACEMENT_FEE_TOO_LOW))
        ) {
          return new SignerError(
            SignerErrorCode.SEND_TX_ERROR,
            undefined,
            'Transaction is underpriced.',
            RangoRPCErrorCode.UNDER_PRICED,
            error
          );
        }
        // gas limit errors are sent as internal errors
        if (
          errorMessage?.includes(RPCErrorMessage.INTRINSIC_GAS_TOO_LOW) ||
          errorMessage?.includes(RPCErrorMessage.OUT_OF_GAS)
        ) {
          return new SignerError(
            SignerErrorCode.SEND_TX_ERROR,
            undefined,
            'Gas limit is low.',
            RangoRPCErrorCode.OUT_OF_GAS,
            error
          );
        }

        const msg = getMessageFromCode(errorCode);
        return new SignerError(
          SignerErrorCode.SEND_TX_ERROR,
          undefined,
          msg ?? error,
          RangoRPCErrorCode.UNKNOWN_ERROR,
          error
        );
      }
    }
    switch (errorCode) {
      case RPCErrorCode.INVALID_ARGUMENT: {
        const msg = (error.reason || error.message) ?? error;
        return new SignerError(
          SignerErrorCode.SEND_TX_ERROR,
          undefined,
          msg,
          RangoRPCErrorCode.UNKNOWN_ERROR,
          error
        );
      }
    }
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
