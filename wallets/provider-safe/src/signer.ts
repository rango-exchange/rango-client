import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: any
): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();
  const { CustomEvmSigner } = await import('./signers/evm.ts');
  signers.registerSigner(TxType.EVM, new CustomEvmSigner(provider));

  return signers;
}
