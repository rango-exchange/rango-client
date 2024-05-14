import type { DefaultSignerFactory, SignerFactory } from 'rango-types';

import { DefaultTerraSigner } from '@rango-dev/signer-terra';
import { TransactionType as TxType } from 'rango-types';

export default function getSigners(
  provider: any,
  defaultSigners: DefaultSignerFactory
): SignerFactory {
  const signers = defaultSigners;
  signers.registerSigner(TxType.COSMOS, new DefaultTerraSigner(provider));
  return signers;
}
