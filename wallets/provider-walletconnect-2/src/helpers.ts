import { Networks } from '@rango-dev/wallets-shared';
import { ProposalTypes, SessionTypes } from '@walletconnect/types';
import { ChainId } from 'caip';
import { BlockchainMeta, cosmosBlockchains, evmBlockchains } from 'rango-types';
import {
  DEFAULT_COSMOS_METHODS,
  DEFAULT_ETHEREUM_EVENTS,
  DEFAULT_ETHEREUM_METHODS,
  DEFAULT_SOLANA_CHAIN_ID,
  DEFAULT_SOLANA_METHODS,
  NAMESPACES,
} from './constants';

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
        .filter((chain) => !!chain.chainId)
        .map((chain) => {
          return new ChainId({
            namespace: NAMESPACES.COSMOS,
            reference: chain.chainId!,
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

export function getChainId(chain: ChainId): number | string {
  if (chain.namespace === NAMESPACES.ETHEREUM) return Number(chain.reference);
  else return chain.reference;
}

export function getAccountsFromSession(
  namespace: string,
  session: SessionTypes.Struct
): string[] {
  // match namespaces e.g. eip155 with eip155:1
  const matchedNamespaceKeys = Object.keys(session.namespaces).filter((key) =>
    key.includes(namespace)
  );
  if (!matchedNamespaceKeys.length) return [];
  const accounts: string[] = [];
  matchedNamespaceKeys.forEach((key) => {
    const accountsForNamespace = session.namespaces[key].accounts;
    accounts.push(...accountsForNamespace);
  });
  return accounts;
}

export function getChainIdByNetworkName(
  network: string | undefined,
  meta: BlockchainMeta[]
): string | undefined {
  if (!network) return;

  // Supported chains by us
  const evm = evmBlockchains(meta);
  const cosmos = cosmosBlockchains(meta);

  // TODO: how about Solana?
  const requestedChain = [...evm, ...cosmos].find(
    (chain) => chain.name === network
  );

  return requestedChain?.chainId || undefined;
}
