import type { DefaultSignerFactory, SignerFactory } from 'rango-types';

import { TransactionType as TxType } from 'rango-types';

import { SolflareSnapSolanaSigner } from './signers/solanaSigner';

export default function getSigners(
  provider: any,
  defaultSigners: DefaultSignerFactory
): SignerFactory {
  const signers = defaultSigners;
  signers.registerSigner(TxType.SOLANA, new SolflareSnapSolanaSigner(provider));
  return signers;
}
