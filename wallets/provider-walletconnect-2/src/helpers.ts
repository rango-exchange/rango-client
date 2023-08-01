import { WalletState } from '@rango-dev/wallets-shared';
import { Networks } from '@rango-dev/wallets-shared';
import { ProposalTypes } from '@walletconnect/types';
import { ChainId } from 'caip';
import { BlockchainMeta, cosmosBlockchains, evmBlockchains } from 'rango-types';
import { Web3Modal } from '@web3modal/standalone';

import {
  DEFAULT_COSMOS_METHODS,
  DEFAULT_ETHEREUM_EVENTS,
  DEFAULT_ETHEREUM_METHODS,
  DEFAULT_SOLANA_CHAIN_ID,
  DEFAULT_SOLANA_METHODS,
  NAMESPACES,
} from './constants';
import { getLastSession } from './session';
import { CosmosMeta } from './types';

let web3Modal: Web3Modal;
export function createModalInstance(projectId: string) {
  if (!web3Modal) {
    web3Modal = new Web3Modal({
      projectId,
      themeMode: 'light',
      walletConnectVersion: 2,
      themeVariables: {
        '--w3m-z-index': '999999999',
      },
    });
  }
}
export function getModal(): Web3Modal {
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
      } else {
        const firstChain = standaloneChains[0];
        const chainId = new ChainId(firstChain);
        return chainId.reference;
      }
    } else {
      throw new Error(`Couldn't find any chain on namespace`);
    }
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
  if (!chainIdInHex) return undefined;

  const chainId = String(parseInt(chainIdInHex));

  return chainId;
}
