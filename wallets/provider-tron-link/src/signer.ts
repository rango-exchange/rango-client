import type { SignerFactory } from 'rango-types';

import { DefaultTronSigner } from '@arlert-dev/signer-tron';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: any
): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.TRON, new DefaultTronSigner(provider));
  return signers;
}
