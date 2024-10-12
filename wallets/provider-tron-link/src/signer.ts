import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: any
): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();
  const { DefaultTronSigner } = await import('@rango-dev/signer-tron');
  signers.registerSigner(TxType.TRON, new DefaultTronSigner(provider));
  return signers;
}
