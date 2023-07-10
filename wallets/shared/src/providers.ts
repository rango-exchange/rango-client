import {
  Network,
  CanSwitchNetwork,
  Subscribe,
  SwitchNetwork,
  Networks,
  CanEagerConnect,
} from './rango';
import { convertEvmBlockchainMetaToEvmChainInfo } from './helpers';
import { switchOrAddNetworkForMetamaskCompatibleWallets } from './helpers';
import type { BlockchainMeta } from 'rango-types';
import { isEvmBlockchain } from 'rango-types';

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
  instance?.on('accountsChanged', (addresses: string[]) => {
    // TODO: after enabling autoconnect, we can consider this condition
    // to be removed.
    // The problem was if a user already connected its wallet,
    // Metamask is triggering this event on first load, so when autoconnect is disabled,
    // it's automaticlally change the state of wallet to `connected`.
    if (state.connected) {
      updateAccounts(addresses);
    }
  });

  instance?.on('chainChanged', (chainId: string) => {
    updateChainId(chainId);
  });
};

export const canEagerlyConnectToEvm: CanEagerConnect = async ({ instance }) => {
  try {
    const accounts: string[] = await instance.request({
      method: 'eth_accounts',
    });
    if (accounts.length) return true;
    else return false;
  } catch (error) {
    return false;
  }
};

export const switchNetworkForEvm: SwitchNetwork = async ({
  instance,
  network,
  meta,
}) => {
  const evmBlockchains = meta.filter(isEvmBlockchain);
  const evmInstance = getNetworkInstance(instance, Networks.ETHEREUM);
  await switchOrAddNetworkForMetamaskCompatibleWallets(
    evmInstance,
    network,
    convertEvmBlockchainMetaToEvmChainInfo(evmBlockchains)
  );
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
  if (!network) return null;
  const evmBlockchains = evmNetworkNames(meta);
  return evmBlockchains.includes(network) ? Networks.ETHEREUM : null;
}

function isEvmNetwork(network: Network | null, meta: BlockchainMeta[]) {
  if (!network) return false;

  return evmNetworkNames(meta).includes(network);
}

export function chooseInstance(
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

export function getNetworkInstance(provider: any, network: Network) {
  return provider.size ? provider.get(network) : provider;
}
