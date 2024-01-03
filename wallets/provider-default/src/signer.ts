import type { SignerFactory } from 'rango-types';

import { DefaultEvmSigner } from '@yeager-dev/signer-evm';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default function getSigners(provider: any): SignerFactory {
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(provider));
  return signers;
}
