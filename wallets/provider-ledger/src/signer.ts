import type { DefaultSignerFactory, SignerFactory } from 'rango-types';

import { TransactionType as TxType } from 'rango-types';

import { EthereumSigner } from './signers/ethereum';
import { SolanaSigner } from './signers/solana';

export default function getSigners(
  _: any,
  defaultSigners: DefaultSignerFactory
): SignerFactory {
  const signers = defaultSigners;
  signers.registerSigner(TxType.EVM, new EthereumSigner());
  signers.registerSigner(TxType.SOLANA, new SolanaSigner());
  return signers;
}
