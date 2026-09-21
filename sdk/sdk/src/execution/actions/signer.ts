import type { Provider } from '@hub3js/core';
import type { DefaultNamespaces } from '@hub3js/namespaces';
import type { Transaction } from 'rango-sdk';
import type { GenericSigner, TransactionType } from 'rango-types';

import { SignerError } from 'rango-types';

import { ActionError, errorMessage } from '../../errors';

/**
 * The signer a wallet registered for a transaction type. Hub providers publish
 * their signers through the `signers` metadata property, which is how the
 * wallets layer hands them out today.
 */
export async function getSigner<Tx extends Transaction>(
  provider: Provider<DefaultNamespaces>,
  txType: TransactionType
): Promise<GenericSigner<Tx>> {
  const properties = provider.info()?.metadata.properties ?? [];

  for (const property of properties) {
    if (property.name === 'signers') {
      const factory = await property.value.getSigners();
      return factory.getSigner<Tx>(txType);
    }
  }

  throw new ActionError(
    'CLIENT_UNEXPECTED_BEHAVIOUR',
    `Wallet ${provider.id} does not expose signers`
  );
}

/**
 * Signs and sends a transaction, mapping whatever the wallet throws to the
 * code the swap fails with: a `SignerError` keeps its own code (for example
 * `REJECTED_BY_USER`), anything else counts as `CALL_OR_SEND_FAILED`.
 */
export async function signAndSendTx<Tx extends Transaction>(
  signer: GenericSigner<Tx>,
  tx: Tx,
  address: string,
  chainId: string | null
): Promise<{ hash: string }> {
  try {
    return await signer.signAndSendTx(tx, address, chainId);
  } catch (error) {
    throw toActionError(error, 'CALL_OR_SEND_FAILED');
  }
}

/**
 * Signs EIP-712 typed data, for the chains whose actions are messages rather
 * than transactions. Errors map as for `signAndSendTx`, except that a wallet
 * error with no signer code is `CALL_WALLET_FAILED`, since nothing was sent.
 * A signer without typed-data support is a client error.
 */
export async function signTypedData<Tx extends Transaction>(
  signer: GenericSigner<Tx>,
  typedData: unknown,
  address: string,
  chainId: string | null
): Promise<string> {
  if (!signer.signTypedData) {
    throw new ActionError(
      'CLIENT_UNEXPECTED_BEHAVIOUR',
      'The wallet signer does not support signing typed data'
    );
  }
  try {
    return await signer.signTypedData(typedData, address, chainId);
  } catch (error) {
    throw toActionError(error, 'CALL_WALLET_FAILED');
  }
}

function toActionError(
  error: unknown,
  fallback: 'CALL_OR_SEND_FAILED' | 'CALL_WALLET_FAILED'
): ActionError {
  if (SignerError.isSignerError(error)) {
    return new ActionError(error.code, error.message, error);
  }
  return new ActionError(fallback, errorMessage(error), error);
}
