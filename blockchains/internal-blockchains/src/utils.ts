import type { Provider } from '@hub3js/core';
import type { Chain } from '@hub3js/evm';
import type { BlockchainMeta, EvmBlockchainMeta } from 'rango-types';

import { convertBlockchainMetaToCaip } from './caip.js';

type ChainSupport = {
  isChainSupported: (chainId: string) => boolean;
};

export type EvmNetworksChainInfo = Record<string, Chain>;

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

/*
 * TODO: remove this. It exists only so a provider can look a chain up by Rango's
 * network name, which is knowledge a provider shouldn't carry — the caller already
 * resolves the chain and should hand the provider an EIP-3085 description instead.
 * Once every consumer does that, this table and the providers' dependency on
 * Rango's chain model go away together.
 */
export function convertEvmBlockchainMetaToEvmChainInfo(
  evmBlockchains: EvmBlockchainMeta[]
): EvmNetworksChainInfo {
  return evmBlockchains.reduce<EvmNetworksChainInfo>(
    (evmNetworksChainInfo, blockchainMeta) => {
      evmNetworksChainInfo[blockchainMeta.name] = {
        chainName: blockchainMeta.info.chainName,
        chainId: blockchainMeta.chainId,
        nativeCurrency: blockchainMeta.info.nativeCurrency,
        rpcUrls: blockchainMeta.info.rpcUrls,
        blockExplorerUrls: blockchainMeta.info.blockExplorerUrls,
      };

      return evmNetworksChainInfo;
    },
    {}
  );
}
