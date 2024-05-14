import type { DefaultSignerFactory, SignerFactory } from 'rango-types';

import { DefaultTronSigner } from '@rango-dev/signer-tron';
import { TransactionType as TxType } from 'rango-types';

export default function getSigners(
  provider: any,
  defaultSigners: DefaultSignerFactory
): SignerFactory {
  const signers = defaultSigners;
  signers.registerSigner(TxType.TRON, new DefaultTronSigner(provider));
  return signers;
}
