import type { TonConnectUI } from '@tonconnect/ui';
import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: TonConnectUI
): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();
  const { CustomTonSigner } = await import('./ton-signer.js');
  signers.registerSigner(TxType.TON, new CustomTonSigner(provider));
  return signers;
}
