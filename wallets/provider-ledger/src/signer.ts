import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { EthereumSigner } from './signers/ethereum.js';
import { SolanaSigner } from './signers/solana.js';

export default function getSigners(): SignerFactory {
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.EVM, new EthereumSigner());
  signers.registerSigner(TxType.SOLANA, new SolanaSigner());
  return signers;
}
