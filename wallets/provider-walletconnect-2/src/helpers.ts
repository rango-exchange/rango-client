import type { WalletConnectModal as WalletConnectModalType } from './wc-types.js';
import type { WalletState } from '@arlert-dev/wallets-shared';
import type { ProposalTypes } from '@walletconnect/types';
import type { BlockchainMeta } from 'rango-types';

import {
  convertEvmBlockchainMetaToEvmChainInfo,
  isEvmAddress,
  Networks,
} from '@arlert-dev/wallets-shared';
import { WalletConnectModal } from '@walletconnect/modal';
import { AccountId, ChainId } from 'caip';
import { evmBlockchains, isEvmBlockchain } from 'rango-types';

import {
  DEFAULT_ETHEREUM_EVENTS,
  DEFAULT_ETHEREUM_METHODS,
  DEFAULT_SOLANA_CHAIN_ID,
  EthereumRPCMethods,
  NAMESPACES,
} from './constants.js';
import { getLastSession } from './session.js';

let web3Modal: WalletConnectModalType;
export function createModalInstance(projectId: string) {
  if (!web3Modal) {
    web3Modal = new WalletConnectModal({
      projectId,
      themeMode: 'light',
      themeVariables: {
        '--wcm-z-index': '999999999',
      },
    }) as unknown as WalletConnectModalType;
  }
}

export function getModal(): WalletConnectModalType {
  return web3Modal;
}

type FinalNamespaces = {
  [key in NAMESPACES]?: ProposalTypes.BaseRequiredNamespace;
};

/*
 * Some wallets like 1inch (android) has problem when we pass cosmos chains in optional namespace
 * Also some wallets like keplr mobile doesn't work when we don't pass cosmos chains in required namespace
 * It seems to be a bug in their current implementation.
 */
export function generateOptionalNamespace(
  meta: BlockchainMeta[]
): FinalNamespaces | undefined {
  const evm = evmBlockchains(meta);
  const evmChains = evm.map((chain) => {
    return new ChainId({
      namespace: NAMESPACES.ETHEREUM,
      reference: String(parseInt(chain.chainId)),
    }).toString();
  });

  const namespaces: FinalNamespaces = {
    [NAMESPACES.ETHEREUM]: {
      methods: DEFAULT_ETHEREUM_METHODS,
      events: DEFAULT_ETHEREUM_EVENTS,
      chains: evmChains,
    },
  };
  return namespaces;
}

export function solanaChainIdToNetworkName(chainId: string): string {
  return chainId === DEFAULT_SOLANA_CHAIN_ID ? Networks.SOLANA : chainId;
}

/**
 *
 * In `rango-preset` we are working with `window.ethereum.request()`,
 * this is an interceptor for some RPC methods (e.g. eth_chainId).
 *
 */
export async function simulateRequest(
  params: any,
  provider: any,
  meta: BlockchainMeta[],
  getState: () => WalletState
) {
  if (params.method === 'eth_chainId') {
    const currentSession = getLastSession(provider);
    const standaloneChains = Object.values(currentSession.namespaces)
      .map((namespace) => namespace.chains)
      .flat() as string[];

    const network = getState().network;

    if (standaloneChains.length > 0) {
      const chainId = network
        ? getChainIdByNetworkName(network, meta)
        : undefined;

      if (chainId) {
        return chainId;
      }

      const firstIndex = 0;
      const firstChain = standaloneChains[firstIndex];
      const firstChainId = new ChainId(firstChain);
      return firstChainId.reference;
    }

    throw new Error(`Couldn't find any chain on namespace`);
  }
  throw new Error('Dissallowed method:', params);
}

export function getChainIdByNetworkName(
  network: string,
  meta: BlockchainMeta[]
): string | undefined {
  const targetBlockchain = meta.find(
    (blockchain) => blockchain.name === network
  );
  const chainIdInHex = targetBlockchain?.chainId;
  if (!chainIdInHex) {
    return undefined;
  }

  const chainId = String(parseInt(chainIdInHex));

  return chainId;
}

export async function switchOrAddEvmChain(
  meta: BlockchainMeta[],
  requestedNetwork: string,
  currentNetwork: string,
  instance: any
) {
  const evmBlockchains = meta.filter(isEvmBlockchain);
  const evmNetworksChainInfo =
    convertEvmBlockchainMetaToEvmChainInfo(evmBlockchains);
  const targetChain = evmNetworksChainInfo[requestedNetwork];
  const targetBlockchain = meta.find(
    (blockchain: BlockchainMeta) => blockchain.name === requestedNetwork
  );
  const chainIdInHex = targetBlockchain?.chainId;

  const currentChainId = getChainIdByNetworkName(currentNetwork, meta);
  const currentChainEip = ChainId.format({
    namespace: NAMESPACES.ETHEREUM,
    reference: String(currentChainId),
  });

  const session = instance.session;

  try {
    await instance.client.request({
      topic: session.topic,
      request: {
        method: EthereumRPCMethods.SWITCH_CHAIN,
        params: [
          {
            chainId: chainIdInHex,
          },
        ],
      },
      // It's required to pass current chain, otherwise it won't work
      chainId: currentChainEip,
    });
  } catch (err: any) {
    const addChainError = 4902;
    if (
      err?.code === addChainError ||
      err?.message?.includes(String(addChainError))
    ) {
      await instance.client.request({
        topic: session.topic,
        request: {
          method: EthereumRPCMethods.ADD_CHAIN,
          params: [targetChain],
        },
        // It's required to pass current chain, otherwise it won't work
        chainId: currentChainEip,
      });
    } else {
      throw err;
    }
  }
}

export function getCurrentEvmAccountAddress(instance: any) {
  return instance.session.namespaces.eip155.accounts
    ?.map((account: string) => {
      return new AccountId(account).address;
    })
    ?.filter((address: string) => isEvmAddress(address))?.[0];
}

export function getEvmAccount(
  network: string,
  address: string,
  meta: BlockchainMeta[]
) {
  const currentChainId = getChainIdByNetworkName(network, meta);
  return AccountId.format({
    chainId: {
      namespace: NAMESPACES.ETHEREUM,
      reference: String(currentChainId),
    },
    address,
  });
}

// It's enough to return only connected network for the EVM networks and ignore others
export function filterEvmAccounts(
  accounts: {
    address: string;
    chainId: string;
  }[],
  currentChainId?: string
) {
  let firstEvmAddress = false;
  return accounts
    .filter(({ address, chainId }) => {
      const isEvm = isEvmAddress(address);
      if (isEvm) {
        if (currentChainId && chainId !== currentChainId) {
          return false;
        }
        if (!currentChainId) {
          if (firstEvmAddress) {
            return false;
          }
          firstEvmAddress = true;
        }
      }
      return true;
    })
    .map(({ address, chainId }) => ({
      accounts: [address],
      chainId: chainId,
    }));
}
