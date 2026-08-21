import type { CanEagerConnect, CanSwitchNetwork, Subscribe } from './rango.js';
import type { LegacyNetwork as Network } from '@rango-dev/wallets-core/legacy';
import type { BlockchainMeta } from 'rango-types';

import { Networks } from '@rango-dev/wallets-blockchains';
import { isEvmBlockchain } from 'rango-types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getEvmAccounts(instance: any) {
  const [accounts, chainId] = await Promise.all([
    instance.request({ method: 'eth_requestAccounts' }) as Promise<string[]>,
    instance.request({ method: 'eth_chainId' }) as Promise<string>,
  ]);

  return {
    accounts,
    chainId,
  };
}

export const subscribeToEvm: Subscribe = ({
  instance,
  state,
  updateChainId,
  updateAccounts,
}) => {
  const handleAccountsChanged = (addresses: string[]) => {
    /*
     * TODO: after enabling autoconnect, we can consider this condition
     * to be removed.
     * The problem was if a user already connected its wallet,
     * Metamask is triggering this event on first load, so when autoconnect is disabled,
     * it's automaticlally change the state of wallet to `connected`.
     */
    if (state.connected) {
      updateAccounts(addresses);
    }
  };

  const handleChainChanged = (chainId: string) => {
    updateChainId(chainId);
  };

  instance?.on?.('accountsChanged', handleAccountsChanged);

  instance?.on?.('chainChanged', handleChainChanged);

  const cleanup = () => {
    instance?.off?.('accountsChanged', handleAccountsChanged);
    instance?.off?.('chainChanged', handleChainChanged);
  };

  return cleanup;
};

export const canEagerlyConnectToEvm: CanEagerConnect = async ({ instance }) => {
  try {
    const accounts: string[] = await instance.request({
      method: 'eth_accounts',
    });
    if (accounts.length) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const canSwitchNetworkToEvm: CanSwitchNetwork = ({ network, meta }) => {
  return evmNetworkNames(meta).includes(network);
};

export function evmNetworkNames(meta: BlockchainMeta[]) {
  return meta.filter(isEvmBlockchain).map((blockchain) => blockchain.name);
}
export function getEthChainsInstance(
  network: Network | null,
  meta: BlockchainMeta[]
): Network | null {
  if (!network) {
    return null;
  }
  const evmBlockchains = evmNetworkNames(meta);
  return evmBlockchains.includes(network) ? Networks.ETHEREUM : null;
}

function isEvmNetwork(network: Network | null, meta: BlockchainMeta[]) {
  if (!network) {
    return false;
  }

  return evmNetworkNames(meta).includes(network);
}

export function chooseInstance(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  instances: null | Map<any, any>,
  meta: BlockchainMeta[],
  network?: Network | null
) {
  // If there is no `network` we fallback to default network.
  network = network || Networks.ETHEREUM;
  const instance_network_name = isEvmNetwork(network, meta)
    ? getEthChainsInstance(network, meta)
    : network;
  const instance =
    !!instances && !!instance_network_name
      ? instances.get(instance_network_name)
      : null;

  return instance;
}
