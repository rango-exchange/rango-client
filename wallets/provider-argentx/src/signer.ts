import type { SignerFactory } from 'rango-types';

import { DefaultStarknetSigner } from '@arlert-dev/signer-starknet';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: any
): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.STARKNET, new DefaultStarknetSigner(provider));
  return signers;
}
