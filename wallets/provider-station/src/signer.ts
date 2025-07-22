import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: any
): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();
  const { DefaultTerraSigner } = await import('@arlert-dev/signer-terra');
  signers.registerSigner(TxType.COSMOS, new DefaultTerraSigner(provider));
  return signers;
}
