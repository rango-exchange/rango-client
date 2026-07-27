import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type { EVM_NAMESPACE, SOLANA_NAMESPACE } from '@hub3js/namespaces';
import type { ProviderAPI as SolanaProviderApi } from '@hub3js/solana';

type ProviderObject = {
  [EVM_NAMESPACE]: EvmProviderApi;
  [SOLANA_NAMESPACE]: SolanaProviderApi;
};

export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;
