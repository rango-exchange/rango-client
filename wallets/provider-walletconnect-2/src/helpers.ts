import {
  convertEvmBlockchainMetaToEvmChainInfo,
  evmChainsToRpcMap,
} from '@rango-dev/wallets-shared';
import UniversalProvider from '@walletconnect/universal-provider';
import { Web3Modal } from '@web3modal/standalone';
import { BlockchainMeta, isEvmBlockchain } from 'rango-types';

const DEFAULT_COSMOS_METHODS = [
  'cosmos_signDirect',
  'cosmos_signAmino',
  'cosmos_getAccounts',
];
const PROJECT_ID = 'f5196d081862c6f2b81c04520ea9301c';
const EVM_CHAINS = [1, 10, 56, 100, 137, 42161, 43114, 1313161554];
const RELAY_URL = 'wss://relay.walletconnect.com';

const COSMOS_CHAINS = ['juno-1', 'cosmoshub-4', 'osmosis-1'];

// Checks if the provider supportsuswitching networks for wallet types
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
  chainId?: number | string;
  force?: boolean;
  meta: BlockchainMeta[];
}): Promise<any> {
  const { force = false, meta, chainId } = options;

  const filteredEIPChains = EVM_CHAINS.filter((chain) => chain !== chainId).map(
    (chain) => `eip155:${chain}`
  );

  const filteredCOSMOSChains = COSMOS_CHAINS.map((chain) => `cosmos:${chain}`);
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
  console.log(filteredEIPChains, rpcMap);

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
          chains: filteredCOSMOSChains,
          methods: DEFAULT_COSMOS_METHODS,
          events: ['accountsChanged', 'chainChanged'],
        },
        // solana: {
        //   methods: ['solana_signTransaction', 'solana_signMessage'],
        //   chains: ['solana:mainnet-beta'],
        //   events: ['accountsChanged', 'chainChanged'],
        // },
      },

      pairingTopic: force ? undefined : pairingTopic,
      skipPairing: force ? false : !!pairingTopic,
    });
  } catch (error) {
    console.log(error);
    throw new Error((error as any)?.message);
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
