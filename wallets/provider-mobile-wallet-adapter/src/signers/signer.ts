import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { mobileWalletAdapter } from '../utils.js';

export default async function getSigners(): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();

  const SOLANASigner = (await import('../signers/solana.js')).default;

  signers.registerSigner(
    TxType.SOLANA,
    new SOLANASigner(mobileWalletAdapter())
  );

  return signers;
}
