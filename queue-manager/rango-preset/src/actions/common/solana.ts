import type { FindProxiedNamespace } from '@hub3js/core';
import type { DefaultNamespaces } from '@hub3js/namespaces';
import type { SolanaWeb3Signer } from '@rango-dev/signer-solana';
import type { SolanaTransaction } from 'rango-types';

import { generalSolanaTransactionExecutor } from '@rango-dev/signer-solana';
import { RPCErrorCode, SignerError, SignerErrorCode } from 'rango-types';

export type SolanaNamespace = FindProxiedNamespace<'solana', DefaultNamespaces>;

type Web3Transaction = Parameters<SolanaWeb3Signer>[0];

/** The code wallets reject a request the user declined with. */
const USER_REJECTED_REQUEST_CODE = 4001;

function isUserRejection(error: unknown): boolean {
  let current: unknown = error;
  while (current) {
    if ((current as { code?: unknown }).code === USER_REJECTED_REQUEST_CODE) {
      return true;
    }
    current = current instanceof Error ? current.cause : undefined;
  }
  return false;
}

/** Turns what the wallet throws while signing into a `SignerError`. */
export function toSolanaSignerError(error: unknown): SignerError {
  if (SignerError.isSignerError(error)) {
    return error;
  }

  const rejected = isUserRejection(error);
  return new SignerError(
    rejected ? SignerErrorCode.REJECTED_BY_USER : SignerErrorCode.SIGN_TX_ERROR,
    undefined,
    error instanceof Error ? error.message : error,
    rejected ? RPCErrorCode.REJECTION : RPCErrorCode.UNKNOWN_ERROR,
    error
  );
}

/*
 * The namespace signs transaction bytes. A legacy transaction isn't signed by
 * the wallet yet, so its signatures aren't required or verified here.
 */
function serializeForSigning(transaction: Web3Transaction): Uint8Array {
  if ('version' in transaction) {
    return transaction.serialize();
  }
  return new Uint8Array(
    transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    })
  );
}

/**
 * Sends a transaction from Rango's API through the wallet's Solana namespace.
 * The namespace only signs it, with the account it's connected to; preparing,
 * simulating, sending to several nodes and waiting for its confirmation stay
 * as `@rango-dev/signer-solana` does them.
 */
export async function sendSolanaTransaction(
  namespace: SolanaNamespace,
  tx: SolanaTransaction,
  walletAddress: string
): Promise<{ hash: string }> {
  if (!('signTransaction' in namespace)) {
    throw SignerError.UnsupportedError('executeSolanaTransaction');
  }

  if (tx.from !== walletAddress) {
    throw new SignerError(
      SignerErrorCode.SIGN_TX_ERROR,
      `Your connected account doesn't match with the required account. Please ensure that you are connected with the correct account and try again.`
    );
  }

  const sign: SolanaWeb3Signer = async (transaction) => {
    try {
      const [output] = await namespace.signTransaction({
        transaction: serializeForSigning(transaction),
      });
      return output.signedTransaction;
    } catch (error) {
      throw toSolanaSignerError(error);
    }
  };

  const hash = await generalSolanaTransactionExecutor(tx, sign);
  return { hash };
}
