import { readAccountAddress } from '@rango-dev/wallets-core';
import { Network, Networks } from '@rango-dev/wallets-shared';
import type { BlockchainMeta } from 'rango-types';
import { isEvmBlockchain } from 'rango-types';

export type Blockchain = {
  name: Network;
  accounts: { address: string; isConnected: boolean }[];
};

export function prepareAccounts(
  accounts: string[],
  connectedNetwork: Network | null,
  evmBasedChains: string[],
  supportedChainNames: Network[] | null
): Blockchain[] {
  const result = {} as { [type in Network]: Blockchain };

  function addAccount(network: Network, address: string) {
    const isConnected = network === connectedNetwork;
    const newAccount = {
      address,
      isConnected,
    };

    if (result[network]) {
      result[network].accounts.push(newAccount);
    } else {
      result[network] = {
        name: network,
        accounts: [newAccount],
      };
    }
  }

  const supportedChains = supportedChainNames || [];

  accounts.forEach((account) => {
    const { address, network } = readAccountAddress(account);

    const hasLimitation = supportedChains.length > 0;
    const isSupported = supportedChains.includes(network);
    const isUnknown = network === Networks.Unknown;
    const notSupportedNetworkByWallet =
      hasLimitation && !isSupported && !isUnknown;
    if (notSupportedNetworkByWallet) return;

    const isEvmBasedChain = evmBasedChains.includes(network);

    if (isEvmBasedChain) {
      const evmChainsSupportedByWallet = supportedChains.filter((chain) =>
        evmBasedChains.includes(chain)
      );
      evmChainsSupportedByWallet.forEach((network) => {
        addAccount(network, address.toLowerCase());
      });
    } else {
      addAccount(network, address);
    }
  });

  return Object.values(result);
}

export function walletAndSupportedChainsNames(
  supportedChains: BlockchainMeta[]
): Network[] | null {
  if (!supportedChains) return null;
  let walletAndSupportedChainsNames: string[] = [];
  walletAndSupportedChainsNames = supportedChains.map(
    (blockchainMeta) => blockchainMeta.name
  );

  return walletAndSupportedChainsNames;
}

export const evmBasedChainsSelector = (blockchains: BlockchainMeta[]) =>
  blockchains
    .map((blockchainMeta) => blockchainMeta)
    .filter(isEvmBlockchain)
    .map((blockchainMeta) => blockchainMeta.name);
