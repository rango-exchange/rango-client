import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { CustomUtxoSigner } from './signers/signer.js';

export default async function getSigners(): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();

  signers.registerSigner(TxType.TRANSFER, new CustomUtxoSigner());
  return signers;
}
