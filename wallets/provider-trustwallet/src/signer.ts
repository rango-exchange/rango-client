import type { Provider } from './utils.js';
import type { SignerFactory } from 'rango-types';

import { LegacyNetworks as Networks } from '@rango-dev/wallets-core/legacy';
import {
  dynamicImportWithRefinedError,
  getNetworkInstance,
} from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const ethProvider = getNetworkInstance(provider, Networks.ETHEREUM);
  const solProvider = getNetworkInstance(provider, Networks.SOLANA);
  const tronProvider = getNetworkInstance(provider, Networks.TRON);

  const signers = new DefaultSignerFactory();
  const { DefaultEvmSigner } = await dynamicImportWithRefinedError(
    async () => await import('@rango-dev/signer-evm')
  );
  const { CustomSolanaSigner } = await dynamicImportWithRefinedError(
    async () => await import('./signers/solanaSigner.js')
  );
  const { CustomTronSigner } = await dynamicImportWithRefinedError(
    async () => await import('./signers/tronSigner.js')
  );

  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  signers.registerSigner(TxType.SOLANA, new CustomSolanaSigner(solProvider));
  signers.registerSigner(TxType.TRON, new CustomTronSigner(tronProvider));

  return signers;
}
