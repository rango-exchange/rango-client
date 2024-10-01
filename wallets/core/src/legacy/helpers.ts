import type { Network } from './types.js';
import type { Options } from './wallet.js';
import type { BlockchainMeta } from 'rango-types';

import { Networks } from './types.js';

export function formatAddressWithNetwork(
  address: string,
  network?: Network | null
) {
  return `${network || ''}:${address}`;
}

export function accountAddressesWithNetwork(
  addresses: string[] | null,
  network?: Network | null
) {
  if (!addresses) {
    return [];
  }

  return addresses.map((address) => {
    return formatAddressWithNetwork(address, network);
  });
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

export function needsCheckInstallation(options: Options) {
  const { checkInstallation = true } = options.config;
  return checkInstallation;
}

export const getBlockChainNameFromId = (
  chainId: string | number,
  blockchains: BlockchainMeta[]
): Network | null => {
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
};
