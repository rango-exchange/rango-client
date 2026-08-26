import type { Network } from './networks.js';
import type { Provider } from '@hub3js/core';
import type { Chain } from '@hub3js/evm';
import type { BlockchainMeta, EvmBlockchainMeta } from 'rango-types';

import { convertBlockchainMetaToCaip } from './caip.js';
import { Networks } from './networks.js';

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

/**
 * Rango addresses carry the chain they belong to, as `ETH:0xabc...`. It predates
 * CAIP-10 and is still the format the widget and the queue manager exchange.
 */
export function formatAddressWithNetwork(
  address: string,
  network?: Network | null
): string {
  return `${network || ''}:${address}`;
}

export function readAccountAddress(addressWithNetwork: string): {
  address: string;
  network: Network;
} {
  const [network, address] = addressWithNetwork.split(':');

  return {
    network,
    address,
  };
}

export function getBlockChainNameFromId(
  chainId: string | number,
  blockchains: BlockchainMeta[]
): Network | null {
  chainId =
    typeof chainId === 'string' && chainId.startsWith('0x')
      ? parseInt(chainId)
      : chainId;

  /*
   * Sometimes providers are passing `Network` as chainId.
   * If chainId is a `Network`, we return itself.
   */
  const allNetworks = Object.values(Networks);
  if (allNetworks.includes(String(chainId) as Networks)) {
    return chainId as Networks;
  }

  if (chainId === 'Binance-Chain-Tigris') {
    return Networks.BINANCE;
  }
  return (
    blockchains
      .filter((blockchainMeta) => !!blockchainMeta.chainId)
      .find((blockchainMeta) => {
        const blockchainChainId = blockchainMeta.chainId?.startsWith('0x')
          ? parseInt(blockchainMeta.chainId)
          : blockchainMeta.chainId;
        return blockchainChainId == chainId;
      })?.name || null
  );
}
