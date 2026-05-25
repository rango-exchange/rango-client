import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(): Promise<SignerFactory> {
  const { Signer: StellarSigner } = await import('./namespaces/stellar/mod.js');

  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.STELLAR, new StellarSigner());
  return signers;
}
