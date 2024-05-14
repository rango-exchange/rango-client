import type { DefaultSignerFactory, SignerFactory } from 'rango-types';

import { DefaultEvmSigner } from '@rango-dev/signer-evm';
import { TransactionType as TxType } from 'rango-types';

export default function getSigners(
  provider: any,
  defaultSigners: DefaultSignerFactory
): SignerFactory {
  const signers = defaultSigners;
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(provider));
  return signers;
}
