import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();
  const { CustomEvmSigner } = await import('./signers/evm.js');
  signers.registerSigner(TxType.EVM, new CustomEvmSigner());

  return signers;
}
