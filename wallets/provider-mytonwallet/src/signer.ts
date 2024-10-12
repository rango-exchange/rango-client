import type { TonProvider } from './types.js';
import type { SignerFactory } from 'rango-types';

import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: TonProvider
): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();
  const { DefaultTonSigner } = await import('@rango-dev/signer-ton');
  signers.registerSigner(TxType.TON, new DefaultTonSigner(provider));
  return signers;
}
