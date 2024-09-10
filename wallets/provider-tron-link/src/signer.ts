import type { SignerFactory } from 'rango-types';

import { DefaultTronSigner } from '@rango-dev/signer-tron';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default function getSigners(provider: any): SignerFactory {
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.TRON, new DefaultTronSigner(provider));
  return signers;
}
