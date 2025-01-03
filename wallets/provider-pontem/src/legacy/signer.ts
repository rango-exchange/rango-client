import type { SignerFactory } from 'rango-types';

import { getNetworkInstance } from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export async function getSigners(provider: any): Promise<SignerFactory> {
  const solProvider = getNetworkInstance(provider, 'Solana');

  const { DefaultSolanaSigner } = await import('@rango-dev/signer-solana');
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.SOLANA, new DefaultSolanaSigner(solProvider));
  return signers;
}
