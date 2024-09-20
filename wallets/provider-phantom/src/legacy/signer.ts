import type { SignerFactory } from 'rango-types';

import { getNetworkInstance, Networks } from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: any
): Promise<SignerFactory> {
  const solProvider = getNetworkInstance(provider, Networks.SOLANA);
  const signers = new DefaultSignerFactory();
  const { DefaultSolanaSigner } = await import('@rango-dev/signer-solana');
  signers.registerSigner(TxType.SOLANA, new DefaultSolanaSigner(solProvider));
  return signers;
}
