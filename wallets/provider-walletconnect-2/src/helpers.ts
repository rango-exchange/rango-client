import { Networks } from '@rango-dev/wallets-shared';
import { ProposalTypes } from '@walletconnect/types';
import { ChainId } from 'caip';
import { BlockchainMeta, cosmosBlockchains, evmBlockchains } from 'rango-types';

import {
  DEFAULT_COSMOS_METHODS,
  DEFAULT_ETHEREUM_EVENTS,
  DEFAULT_ETHEREUM_METHODS,
  DEFAULT_SOLANA_CHAIN_ID,
  DEFAULT_SOLANA_METHODS,
  NAMESPACES,
  PROJECT_ID,
} from './constants';
import { getLastSession } from './session';
import { CosmosMeta } from './types';

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

  return {
    [NAMESPACES.ETHEREUM]: {
      methods: DEFAULT_ETHEREUM_METHODS,
      events: DEFAULT_ETHEREUM_EVENTS,
      chains: evm.map((chain) => {
        return new ChainId({
          namespace: NAMESPACES.ETHEREUM,
          reference: String(parseInt(chain.chainId)),
        }).toString();
      }),
    },
    [NAMESPACES.COSMOS]: {
      methods: DEFAULT_COSMOS_METHODS,
      events: [],
      chains: cosmos
        .filter((chain): chain is CosmosMeta => !!chain.chainId)
        .map((chain) => {
          return new ChainId({
            namespace: NAMESPACES.COSMOS,
            reference: chain.chainId,
          }).toString();
        }),
    },
    [NAMESPACES.SOLANA]: {
      methods: DEFAULT_SOLANA_METHODS,
      events: [],
      chains: [`solana:${DEFAULT_SOLANA_CHAIN_ID}`],
    },
  };
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
export async function simulateRequest(params: any, provider: any) {
  if (params.method === 'eth_chainId') {
    const currentSession = getLastSession(provider);
    const standaloneChains = Object.values(currentSession.namespaces)
      .map((namespace) => namespace.chains)
      .flat() as string[];

    if (standaloneChains.length > 0) {
      const firstChain = standaloneChains[0];
      const chainId = new ChainId(firstChain);
      return chainId.reference;
    } else {
      throw new Error(`Couldn't find any chain on namespace`);
    }
  }
  throw new Error('Dissallowed method:', params);
}

export const getProviderUrl = (chainId: string) => {
  return `https://rpc.walletconnect.com/v1/?chainId=solana:${chainId}&projectId=${PROJECT_ID}`;
};
