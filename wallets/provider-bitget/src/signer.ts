import type { SignerFactory } from 'rango-types';

import {
  type LegacyNetworkProviderMap,
  LegacyNetworks,
} from '@rango-dev/wallets-core/legacy';
import {
  dynamicImportWithRefinedError,
  getNetworkInstance,
} from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { BitgetUTXOSigner } from './signers/utxo.js';

export default async function getSigners(
  provider: LegacyNetworkProviderMap
): Promise<SignerFactory> {
  const ethProvider = getNetworkInstance(provider, LegacyNetworks.ETHEREUM);
  const tronProvider = getNetworkInstance(provider, LegacyNetworks.TRON);
  const utxoProvider = getNetworkInstance(provider, LegacyNetworks.BTC);

  const signers = new DefaultSignerFactory();
  const { DefaultEvmSigner } = await dynamicImportWithRefinedError(
    async () => await import('@rango-dev/signer-evm')
  );
  const { DefaultTronSigner } = await dynamicImportWithRefinedError(
    async () => await import('@rango-dev/signer-tron')
  );
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  signers.registerSigner(TxType.TRON, new DefaultTronSigner(tronProvider));
  signers.registerSigner(TxType.TRANSFER, new BitgetUTXOSigner(utxoProvider));

  return signers;
}
