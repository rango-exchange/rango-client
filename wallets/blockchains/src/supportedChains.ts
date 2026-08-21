import type { Provider } from '@hub3js/core';
import type { BlockchainMeta } from 'rango-types';

import { convertBlockchainMetaToCaip } from './caip.js';

type ChainSupport = {
  isChainSupported: (chainId: string) => boolean;
};

/**
 * The chains of `allBlockChains` a single namespace can address. Chains that don't
 * convert to CAIP are dropped rather than guessed at - see
 * {@link convertBlockchainMetaToCaip}.
 */
export function getSupportedChainsFromNamespace(
  namespace: ChainSupport,
  allBlockChains: BlockchainMeta[] | undefined
): BlockchainMeta[] {
  return (
    allBlockChains?.filter((blockchain) => {
      const chainId = convertBlockchainMetaToCaip(blockchain);

      return chainId ? namespace.isChainSupported(chainId) : false;
    }) ?? []
  );
}

/**
 * The union of what every namespace of a provider supports, in `allBlockChains` order
 * and without duplicates when two namespaces claim the same chain.
 */
export function getSupportedChainsFromProvider(
  provider: Provider,
  allBlockChains: BlockchainMeta[] | undefined
): BlockchainMeta[] {
  const namespacesProperty = provider
    .info()
    ?.metadata.properties?.find((property) => property.name === 'namespaces');

  return (
    allBlockChains?.filter((blockchain) => {
      const chainId = convertBlockchainMetaToCaip(blockchain);

      if (!chainId) {
        return false;
      }

      return (
        namespacesProperty?.value.data.some((namespace) =>
          namespace.isChainSupported(chainId)
        ) ?? false
      );
    }) ?? []
  );
}
