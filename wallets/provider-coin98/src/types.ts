import type { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import type { ProviderAPI as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';
import type { ProviderAPI as SolanaProviderApi } from '@rango-dev/wallets-core/namespaces/solana';

type ProviderObject = {
  [LegacyNetworks.ETHEREUM]: EvmProviderApi;
  [LegacyNetworks.SOLANA]: SolanaProviderApi;
};

export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;
