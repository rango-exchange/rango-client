import type { SignerFactory } from 'rango-types';

import { DefaultTerraSigner } from '@rango-dev/signer-terra';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default function getSigners(provider: any): SignerFactory {
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.COSMOS, new DefaultTerraSigner(provider));
  return signers;
}
