import type { LegacyNetworkProviderMap } from '@rango-dev/wallets-core/legacy';
import type { SignerFactory } from 'rango-types';

import { DefaultTronSigner } from '@rango-dev/signer-tron';
import {
  getNetworkInstance,
  Networks,
  retryLazyImport,
} from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: LegacyNetworkProviderMap
): Promise<SignerFactory> {
  const ethProvider = getNetworkInstance(provider, Networks.ETHEREUM);
  const tronProvider = getNetworkInstance(provider, Networks.TRON);
  const signers = new DefaultSignerFactory();
  const { DefaultEvmSigner } = await retryLazyImport(
    async () => await import('@rango-dev/signer-evm')
  );
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  signers.registerSigner(TxType.TRON, new DefaultTronSigner(tronProvider));
  return signers;
}
