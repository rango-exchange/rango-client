import type { SignerError as SignerErrorType } from 'rango-types';

import { isError, toQuantity } from 'ethers';
import {
  RPCErrorCode as RangoRPCErrorCode,
  SignerError,
  SignerErrorCode,
} from 'rango-types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  } catch {
    return;
  }
}

/**
 * Convert a decimal or hex numeric string to an EIP-1474 hex QUANTITY.
 *
 * Needed wherever transaction params reach a wallet without passing through
 * ethers first (WalletConnect's relay, TrezorConnect), since a wallet parsing
 * a decimal string as the QUANTITY it's declared to be reads a wildly larger
 * number. `toQuantity` accepts both "611580889" and "0x28984", handles values
 * beyond Number.MAX_SAFE_INTEGER, and throws on inputs that aren't a valid
 * QUANTITY (negatives, empty strings) instead of emitting a malformed one.
 */
export const toHexQuantity = (value: string): string => toQuantity(value);

export const waitMs = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
