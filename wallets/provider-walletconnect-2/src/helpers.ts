// import {
//   convertEvmBlockchainMetaToEvmChainInfo,
//   evmChainsToRpcMap,
// } from '@rango-dev/wallets-shared';
import UniversalProvider from '@walletconnect/universal-provider';
import { Web3Modal } from '@web3modal/standalone';
import { BlockchainMeta } from 'rango-types';

const DEFAULT_COSMOS_METHODS = ['cosmos_signDirect', 'cosmos_signAmino'];
const PROJECT_ID = 'f5196d081862c6f2b81c04520ea9301c';
// const CHAINS = [1, 10, 56, 100, 137, 42161, 43114, 1313161554];
const RELAY_URL = 'wss://relay.walletconnect.com';

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
  const { force = false } = options;

  // Filters out the current chain from the available chains
  // const filteredChains = CHAINS.filter((chain) => chain !== chainId);
  // const filteredEIPChains = filteredChains.map((chain) => `eip155:${chain}`);

  // Initializes the UniversalProvider
  const provider = await UniversalProvider.init({
    relayUrl: RELAY_URL,
    projectId: PROJECT_ID,
  });

  // Extracts the EVM blockchains from the provided meta information
  // const evmBlockchains = meta.filter(isEvmBlockchain);
  // const rpcMap = evmChainsToRpcMap(
  //   convertEvmBlockchainMetaToEvmChainInfo(evmBlockchains)
  // );

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
        // eip155: {
        //   methods: [
        //     'eth_sendTransaction',
        //     'eth_signTransaction',
        //     'eth_sign',
        //     'personal_sign',
        //     'eth_signTypedData',
        //     'wallet_addEthereumChain',
        //     'wallet_switchEthereumChain',
        //   ],
        //   chains: [`eip155:${chainId}`, ...filteredEIPChains],
        //   events: ['chainChanged', 'accountsChanged'],
        //   rpcMap,
        // },
        cosmos: {
          chains: ['cosmos:cosmoshub-4'],
          methods: DEFAULT_COSMOS_METHODS,
          events: ['accountsChanged', 'chainChanged'],
        },
        // solana: {
        //   methods: ['solana_signTransaction', 'solana_signMessage'],
        //   chains: ['solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ'],
        //   events: ['accountsChanged', 'chainChanged'],
        // },
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
