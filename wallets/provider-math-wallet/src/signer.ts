import type { LegacyNetworkProviderMap } from '@rango-dev/wallets-core/legacy';
import type { SignerFactory } from 'rango-types';

import { DefaultSolanaSigner } from '@rango-dev/signer-solana';
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
  const solProvider = getNetworkInstance(provider, Networks.SOLANA);
  const cosmosProvider = getNetworkInstance(provider, Networks.COSMOS);

  const signers = new DefaultSignerFactory();
  const { DefaultEvmSigner } = await retryLazyImport(
    async () => await import('@rango-dev/signer-evm')
  );
  const { MathWalletCosmosSigner } = await retryLazyImport(
    async () => await import('./signers/cosmosSigner.js')
  );

  if (!!ethProvider) {
    signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  }
  if (!!solProvider) {
    signers.registerSigner(TxType.SOLANA, new DefaultSolanaSigner(solProvider));
  }
  if (!!cosmosProvider) {
    signers.registerSigner(
      TxType.COSMOS,
      new MathWalletCosmosSigner(cosmosProvider)
    );
  }

  return signers;
}
