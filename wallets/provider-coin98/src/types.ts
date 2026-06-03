import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type { ProviderAPI as SolanaProviderApi } from '@hub3js/solana';
import type { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

type ProviderObject = {
  [LegacyNetworks.ETHEREUM]: EvmProviderApi;
  [LegacyNetworks.SOLANA]: SolanaProviderApi;
};

export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;
