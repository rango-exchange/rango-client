import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provider: any
): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();
  const { DefaultTonSigner } = await import('@rango-dev/signer-ton');
  signers.registerSigner(TxType.TON, new DefaultTonSigner(provider));
  return signers;
}
