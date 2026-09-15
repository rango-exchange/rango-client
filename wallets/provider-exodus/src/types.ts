import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type { EVM_NAMESPACE, SOLANA_NAMESPACE } from '@hub3js/namespaces';
import type { InstanceMap } from '@hub3js/std/types';
import type { SolanaExternalProvider } from '@rango-dev/signer-solana';

export type ProviderObject = {
  [EVM_NAMESPACE]: EvmProviderApi;
  [SOLANA_NAMESPACE]: SolanaExternalProvider;
};
export type Provider = InstanceMap<ProviderObject>;
