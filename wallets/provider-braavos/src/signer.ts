import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: any
): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();
  const { DefaultStarknetSigner } = await import('@rango-dev/signer-starknet');
  signers.registerSigner(TxType.STARKNET, new DefaultStarknetSigner(provider));
  return signers;
}
