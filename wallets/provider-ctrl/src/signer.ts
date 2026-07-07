import type { Provider } from './types.js';
import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type { SolanaExternalProvider } from '@rango-dev/signer-solana';
import type { SignerFactory } from 'rango-types';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

import { CustomSolanaSigner } from './signers/solana.js';
import { CustomTransferSigner } from './signers/utxo.js';

export default async function getSigners(
  provider: Provider
): Promise<SignerFactory> {
  const ethProvider = provider.get(LegacyNetworks.ETHEREUM) as EvmProviderApi;
  const solProvider = provider.get(
    LegacyNetworks.SOLANA
  ) as SolanaExternalProvider;

  const signers = new DefaultSignerFactory();
  const { DefaultEvmSigner } = await import('@rango-dev/signer-evm');

  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  signers.registerSigner(TxType.SOLANA, new CustomSolanaSigner(solProvider));
  // the transfer signer comprises several UTXO chains, so it gets the whole map
  signers.registerSigner(TxType.TRANSFER, new CustomTransferSigner(provider));
  return signers;
}
