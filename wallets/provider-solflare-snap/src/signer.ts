import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { SolflareSnapSolanaSigner } from './signers/solanaSigner';

export default function getSigners(provider: any): SignerFactory {
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.SOLANA, new SolflareSnapSolanaSigner(provider));
  return signers;
}
