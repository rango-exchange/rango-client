import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();
  const { BTCSigner } = await import('./signers/utxo.js');
  signers.registerSigner(TxType.TRANSFER, new BTCSigner());
  return signers;
}
