import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(): Promise<SignerFactory> {
  const { XrplSigner } = await import('./signers/xrpl.js');
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.XRPL, new XrplSigner());
  return signers;
}
