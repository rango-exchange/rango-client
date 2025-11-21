import type { Provider } from './types.js';
import type { SignerFactory } from 'rango-types';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import {
  dynamicImportWithRefinedError,
  getNetworkInstance,
} from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType } from 'rango-types';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const signers = new DefaultSignerFactory();

  const starknetProvider = getNetworkInstance(
    provider,
    LegacyNetworks.STARKNET
  );

  const { DefaultStarknetSigner } = await dynamicImportWithRefinedError(
    async () => await import('@rango-dev/signer-starknet')
  );
  signers.registerSigner(
    TransactionType.STARKNET,
    new DefaultStarknetSigner(starknetProvider)
  );
  return signers;
}
