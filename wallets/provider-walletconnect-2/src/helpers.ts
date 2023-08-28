import type { CosmosMeta } from './types';
import type { WalletState } from '@rango-dev/wallets-shared';
import type { ProposalTypes } from '@walletconnect/types';
import type { BlockchainMeta } from 'rango-types';

import { Networks } from '@rango-dev/wallets-shared';
import { WalletConnectModal } from '@walletconnect/modal';
import { ChainId } from 'caip';
import { cosmosBlockchains, evmBlockchains } from 'rango-types';

import {
  DEFAULT_COSMOS_METHODS,
  DEFAULT_ETHEREUM_EVENTS,
  DEFAULT_ETHEREUM_METHODS,
  DEFAULT_SOLANA_CHAIN_ID,
  DEFAULT_SOLANA_METHODS,
  NAMESPACES,
} from './constants';
import { getLastSession } from './session';

let web3Modal: WalletConnectModal;
export function createModalInstance(projectId: string) {
  if (!web3Modal) {
    web3Modal = new WalletConnectModal({
      projectId,
      themeMode: 'light',
      themeVariables: {
        '--wcm-z-index': '999999999',
      },
    });
  }
}
export function getModal(): WalletConnectModal {
  return web3Modal;
}

type FinalNamespaces = {
  [key in NAMESPACES]?: ProposalTypes.BaseRequiredNamespace;
};

export function generateRequiredNamespace(
  meta: BlockchainMeta[],
  network: string
): FinalNamespaces | undefined {
  const evm = evmBlockchains(meta);
  const cosmos = cosmosBlockchains(meta);

  const requiredEvmChain = evm.find((chain) => chain.name === network);
  const requiredCosmosChain = cosmos.find((chain) => chain.name === network);
  const requiredSolanaChain = network === Networks.SOLANA;

  if (requiredEvmChain) {
    return {
      [NAMESPACES.ETHEREUM]: {
        events: DEFAULT_ETHEREUM_EVENTS,
        methods: DEFAULT_ETHEREUM_METHODS,
        chains: [
          new ChainId({
            namespace: NAMESPACES.ETHEREUM,
            reference: String(parseInt(requiredEvmChain.chainId)),
          }).toString(),
        ],
      },
    };
  } else if (!!requiredCosmosChain) {
    return {
      [NAMESPACES.COSMOS]: {
        events: [],
        methods: DEFAULT_COSMOS_METHODS,
        chains: [
          new ChainId({
            namespace: NAMESPACES.COSMOS,
            reference: requiredCosmosChain.chainId!,
          }).toString(),
        ],
      },
    };
  } else if (requiredSolanaChain) {
    return {
      [NAMESPACES.SOLANA]: {
        events: [],
        methods: DEFAULT_SOLANA_METHODS,
        chains: [`solana:${DEFAULT_SOLANA_CHAIN_ID}`],
      },
    };
  }

  return undefined;
}

export function generateOptionalNamespace(
  meta: BlockchainMeta[]
): FinalNamespaces | undefined {
  const evm = evmBlockchains(meta);
  const cosmos = cosmosBlockchains(meta);
  const evmChains = evm.map((chain) => {
    return new ChainId({
      namespace: NAMESPACES.ETHEREUM,
      reference: String(parseInt(chain.chainId)),
    }).toString();
  });
  const cosmosChains = cosmos
    .filter((chain): chain is CosmosMeta => !!chain.chainId)
    .map((chain) => {
      return new ChainId({
        namespace: NAMESPACES.COSMOS,
        reference: chain.chainId,
      }).toString();
    });

  const namespaces: FinalNamespaces = {
    [NAMESPACES.ETHEREUM]: {
      methods: DEFAULT_ETHEREUM_METHODS,
      events: DEFAULT_ETHEREUM_EVENTS,
      chains: evmChains,
    },
    [NAMESPACES.SOLANA]: {
      methods: DEFAULT_SOLANA_METHODS,
      events: [],
      chains: [`solana:${DEFAULT_SOLANA_CHAIN_ID}`],
    },
  };

  if (cosmosChains.length) {
    namespaces[NAMESPACES.COSMOS] = {
      methods: DEFAULT_COSMOS_METHODS,
      events: [],
      chains: cosmosChains,
    };
  }

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
