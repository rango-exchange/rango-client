import type { SOLANA_NAMESPACE } from '@hub3js/namespaces';
import type { InstanceMap } from '@hub3js/std/types';
import type { SolanaExternalProvider } from '@rango-dev/signer-solana';

export type ProviderObject = {
  [SOLANA_NAMESPACE]: SolanaExternalProvider;
};
export type Provider = InstanceMap<ProviderObject>;
