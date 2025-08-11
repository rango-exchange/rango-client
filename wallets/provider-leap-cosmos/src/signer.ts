import type { LegacyNetworkProviderMap } from '@rango-dev/wallets-core/legacy';
import type { SignerFactory } from 'rango-types';

import {
  getNetworkInstance,
  Networks,
  retryLazyImport,
} from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: LegacyNetworkProviderMap
): Promise<SignerFactory> {
  const cosmosProvider = getNetworkInstance(provider, Networks.COSMOS);
  const signers = new DefaultSignerFactory();
  const { DefaultCosmosSigner } = await retryLazyImport(
    async () => await import('@rango-dev/signer-cosmos')
  );
  signers.registerSigner(
    TxType.COSMOS,
    new DefaultCosmosSigner(cosmosProvider)
  );
  return signers;
}
