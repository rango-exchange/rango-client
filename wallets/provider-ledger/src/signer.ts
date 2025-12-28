import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { EthereumSigner } from './signers/ethereum';
import { SolanaSigner } from './signers/solana';
import { BtcSigner } from './signers/utxo';

export default async function getSigners(): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.EVM, new EthereumSigner());
  signers.registerSigner(TxType.SOLANA, new SolanaSigner());
  signers.registerSigner(TxType.TRANSFER, new BtcSigner());
  return signers;
}
