import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { EthereumSigner } from './signers/ethereum.js';

export default function getSigners(): SignerFactory {
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.EVM, new EthereumSigner());
  return signers;
}
