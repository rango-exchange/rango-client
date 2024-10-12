import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: any
): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();
  const { SolflareSnapSolanaSigner } = await import(
    './signers/solanaSigner.js'
  );
  signers.registerSigner(TxType.SOLANA, new SolflareSnapSolanaSigner(provider));
  return signers;
}
