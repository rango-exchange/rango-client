import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(): Promise<SignerFactory> {
  const { Signer: ZcashSigner } = await import('./namespaces/zcash/mod.js');
  const signers = new DefaultSignerFactory();

  signers.registerSigner(TxType.TRANSFER, new ZcashSigner());
  return signers;
}
