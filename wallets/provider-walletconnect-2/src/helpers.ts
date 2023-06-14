import UniversalProvider from '@walletconnect/universal-provider';
import { Web3Modal } from '@web3modal/standalone';
const PROJECT_ID = 'f5196d081862c6f2b81c04520ea9301c';
// const CHAINS = [1, 56];
// const DEFAULT_COSMOS_METHODS = ['cosmos_signDirect', 'cosmos_signAmino'];
const walletConnectModal = new Web3Modal({
  projectId: PROJECT_ID,
  walletConnectVersion: 2,
  themeVariables: {
    '--w3m-z-index': '999999999',
  },
});
const relayUrl = 'wss://relay.walletconnect.com';

export function supportsForSwitchNetworkRequest(provider: any): boolean {
  const wallets = ['metamask', 'safepal'];
  const connectedWallet = provider?.session?.peer?.metadata
    ? provider.session.peer.metadata.name
    : '';

  return wallets.some((wallet) => {
    return connectedWallet.toLowerCase().includes(wallet);
  });
}

export async function makeConnection(options: {
  chainId?: number;
  force?: boolean;
}): Promise<any> {
  const { force = false } = options;
  // const filteredChains = CHAINS.filter((chain) => chain !== chainId);
  // const filteredEIPChains = filteredChains.map((chain) => `eip155:${chain}`);

  const provider = await UniversalProvider.init({
    relayUrl,
    projectId: PROJECT_ID,
  });

  console.log('provider', provider);

  provider.on('display_uri', (uri: string) => {
    console.log('uri', uri);

    walletConnectModal.openModal({ uri });
  });
  const lastIndex =
    provider.client.pairing.getAll({
      active: true,
    }).length - 1;
  const pairingTopic = provider.client.pairing.getAll({
    active: true,
  })[lastIndex]?.topic;
  console.log('pairingTopic', pairingTopic);

  //  create sub providers for each namespace/chain
  try {
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
        //   chains: [`eip155:${chainId}`].concat(filteredEIPChains),
        //   events: ['chainChanged', 'accountsChanged'],
        //   // rpcMap: {
        //   //   [chainId]: `https://rpc.walletconnect.com?chainId=eip155:${chainId}&projectId=f5196d081862c6f2b81c04520ea9301c`,
        //   // },
        // },
        cosmos: {
          chains: ['cosmos:cosmoshub-4'],
          methods: ['cosmos_signDirect'],
          events: ['accountsChanged', 'chainChanged'],
        },
      },
      pairingTopic: pairingTopic, // optional topic to connect to
      skipPairing: force ? false : !!pairingTopic,
    });
  } catch (e) {
    console.log(e);
  }
  walletConnectModal?.closeModal();

  return provider;
}
