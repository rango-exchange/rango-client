import type { Provider } from '../utils.js';
import type { SignerFactory } from 'rango-types';

import { LegacyNetworks as Networks } from '@rango-dev/wallets-core/legacy';
import { getInstance as getSuiInstance } from '@rango-dev/wallets-core/namespaces/sui';
import { getNetworkInstance, retryLazyImport } from '@rango-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { WALLET_NAME_IN_WALLET_STANDARD } from '../constants.js';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const solProvider = getNetworkInstance(provider, Networks.SOLANA);
  const evmProvider = getNetworkInstance(provider, Networks.ETHEREUM);
  const bitcoinInstance = getNetworkInstance(provider, Networks.BTC);

  const suiProvider = getSuiInstance(WALLET_NAME_IN_WALLET_STANDARD);

  const { DefaultEvmSigner } = await retryLazyImport(
    async () => await import('@rango-dev/signer-evm')
  );
  const { DefaultSolanaSigner } = await retryLazyImport(
    async () => await import('@rango-dev/signer-solana')
  );
  const { BTCSigner } = await retryLazyImport(
    async () => await import('./utxoSigner.js')
  );
  const { DefaultSuiSigner } = await retryLazyImport(
    async () => await import('@rango-dev/signer-sui')
  );
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.SOLANA, new DefaultSolanaSigner(solProvider));
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(evmProvider));
  signers.registerSigner(TxType.TRANSFER, new BTCSigner(bitcoinInstance));
  if (!!suiProvider) {
    signers.registerSigner(TxType.SUI, new DefaultSuiSigner(suiProvider));
  }
  return signers;
}
