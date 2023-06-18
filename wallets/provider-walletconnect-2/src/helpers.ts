import {
  convertEvmBlockchainMetaToEvmChainInfo,
  evmChainsToRpcMap,
  Networks,
} from '@rango-dev/wallets-shared';
import { ProposalTypes } from '@walletconnect/types';
import UniversalProvider from '@walletconnect/universal-provider';
import { Web3Modal } from '@web3modal/standalone';
import { ChainId } from 'caip';
import {
  BlockchainMeta,
  cosmosBlockchains,
  evmBlockchains,
  isEvmBlockchain,
} from 'rango-types';
import {
  DEFAULT_COSMOS_METHODS,
  DEFAULT_ETHEREUM_EVENTS,
  DEFAULT_ETHEREUM_METHODS,
  DEFAULT_SOLANA_CHAIN_ID,
  DEFAULT_SOLANA_METHODS,
  NAMESPACES,
} from '.';

// TODO: Update with real data
export const DEFAULT_APP_METADATA = {
  name: 'Rango',
  description: 'React App for WalletConnect',
  url: 'https://app.rango.exchange/',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

export const PROJECT_ID = 'f5196d081862c6f2b81c04520ea9301c';
const CHAINS = [1, 10, 56, 100, 137, 42161, 43114, 1313161554];
export const RELAY_URL = 'wss://relay.walletconnect.com';

// Checks if the provider supports switching networks for wallet types
export function supportsForSwitchNetworkRequest(
  provider: UniversalProvider
): boolean {
  const wallets = ['metamask', 'safepal'];
  const connectedWallet =
    provider?.session?.peer?.metadata?.name?.toLowerCase() || '';

  return wallets.some((wallet) => connectedWallet.includes(wallet));
}

// Establishes a connection with the UniversalProvider
export async function makeConnection(options: {
  chainId?: number;
  force?: boolean;
  meta: BlockchainMeta[];
}): Promise<any> {
  const { chainId = 1, force = false, meta } = options;

  // Filters out the current chain from the available chains
  const filteredChains = CHAINS.filter((chain) => chain !== chainId);
  const filteredEIPChains = filteredChains.map((chain) => `eip155:${chain}`);

  // Initializes the UniversalProvider
  const provider = await UniversalProvider.init({
    relayUrl: RELAY_URL,
    projectId: PROJECT_ID,
  });

  // Extracts the EVM blockchains from the provided meta information
  const evmBlockchains = meta.filter(isEvmBlockchain);
  const rpcMap = evmChainsToRpcMap(
    convertEvmBlockchainMetaToEvmChainInfo(evmBlockchains)
  );

  // Opens the WalletConnect modal when display_uri event is emitted
  provider.on('display_uri', (uri: string) => {
    walletConnectModal.openModal({ uri });
  });

  // Retrieves the pairing information for the active session
  const pairings = provider.client.pairing.getAll({ active: true });
  const lastIndex = pairings.length - 1;
  const pairingTopic = pairings[lastIndex]?.topic;

  try {
    // Connects to the specified chains and sets up event listeners
    await provider.connect({
      namespaces: {
        eip155: {
          methods: [
            'eth_sendTransaction',
            'eth_signTransaction',
            'eth_sign',
            'personal_sign',
            'eth_signTypedData',
            'wallet_addEthereumChain',
            'wallet_switchEthereumChain',
          ],
          chains: [`eip155:${chainId}`, ...filteredEIPChains],
          events: ['chainChanged', 'accountsChanged'],
          rpcMap,
        },
      },
      pairingTopic: force ? undefined : pairingTopic,
      skipPairing: force ? false : !!pairingTopic,
    });
  } catch (error) {
    console.log(error);
  }

  // Closes the WalletConnect modal if it exists
  walletConnectModal?.closeModal();

  return provider;
}

// Creates a new instance of Web3Modal for WalletConnect
const walletConnectModal = new Web3Modal({
  projectId: PROJECT_ID,
  walletConnectVersion: 2,
  themeVariables: {
    '--w3m-z-index': '999999999',
  },
});

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
