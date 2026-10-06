import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { SolanaSigner } from './signers/solana';

export default async function getSigners(): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.SOLANA, new SolanaSigner());
  return signers;
}
