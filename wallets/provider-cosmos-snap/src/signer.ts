import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import StarknetSigner from './signers/cosmos';

export default function getSigners(provider: any): SignerFactory {
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.STARKNET, new StarknetSigner(provider));
  return signers;
}
