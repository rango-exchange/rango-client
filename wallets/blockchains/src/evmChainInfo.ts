import type { Chain } from '@hub3js/evm';
import type { EvmBlockchainMeta } from 'rango-types';

export type EvmNetworksChainInfo = Record<string, Chain>;

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
