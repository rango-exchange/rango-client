import type { DefaultSignerFactory, SignerFactory } from 'rango-types';

import { TransactionType as TxType } from 'rango-types';

import { CustomEvmSigner } from './evm-signer';

export default function getSigners(
  provider: any,
  defaultSigners: DefaultSignerFactory
): SignerFactory {
  const signers = defaultSigners;
  signers.registerSigner(TxType.EVM, new CustomEvmSigner(provider));

  return signers;
}
