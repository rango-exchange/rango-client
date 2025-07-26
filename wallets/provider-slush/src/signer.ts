import type { SignerFactory } from 'rango-types';

import { getInstanceOrThrow } from '@rango-dev/wallets-core/namespaces/sui';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { WALLET_NAME_IN_WALLET_STANDARD } from './constants.js';

export default async function getSigners(): Promise<SignerFactory> {
  const suiWalletProvider = getInstanceOrThrow(WALLET_NAME_IN_WALLET_STANDARD);

  const { DefaultSuiSigner } = await import('@rango-dev/signer-sui');
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.SUI, new DefaultSuiSigner(suiWalletProvider));
  return signers;
}
