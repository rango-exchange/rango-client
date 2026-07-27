import type { SOLANA_NAMESPACE } from '@hub3js/namespaces';
import type { ProviderAPI as SolanaProviderApi } from '@hub3js/solana';

export type ProviderObject = {
  [SOLANA_NAMESPACE]: SolanaProviderApi;
};
export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;
