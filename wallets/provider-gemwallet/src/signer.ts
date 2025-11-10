import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(): Promise<SignerFactory> {
  const { Signer: XrplSigner } = await import('./namespaces/xrpl/mod.js');
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.XRPL, new XrplSigner());
  return signers;
}
