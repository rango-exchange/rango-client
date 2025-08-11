import type { SignerFactory } from 'rango-types';

import { retryLazyImport } from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: unknown
): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();
  const { DefaultTerraSigner } = await retryLazyImport(
    async () => await import('@rango-dev/signer-terra')
  );
  signers.registerSigner(TxType.COSMOS, new DefaultTerraSigner(provider));
  return signers;
}
