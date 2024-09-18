import type Solflare from '@solflare-wallet/sdk';
import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: Solflare
): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();
  const { CustomSolanaSigner } = await import('./signers/solanaSigner.js');
  signers.registerSigner(TxType.SOLANA, new CustomSolanaSigner(provider));
  return signers;
}
