import { EthereumProvider } from '@walletconnect/ethereum-provider';

const projectId = 'f5196d081862c6f2b81c04520ea9301c';
// const relayUrl = 'wss://relay.walletconnect.com';

export function supportsForSwitchNetworkRequest(provider: any): boolean {
  const wallets = ['metamask'];
  const connectedWallet = provider.session.peer.metadata
    ? provider.session.peer.metadata.name
    : '';

  return wallets.some((wallet) => {
    return connectedWallet.toLowerCase().includes(wallet);
  });
}

export async function makeConnection(options: {
  chainId?: number;
  provider: any;
}): Promise<any> {
  const { provider, chainId } = options;

  const ethProvider =
    provider ||
    (await EthereumProvider.init({
      projectId, // REQUIRED your projectId
      chains: [chainId || 1],
      // REQUIRED chain ids
      showQrModal: true, // REQUIRED set to "true" to use @web3modal/standalone,
      methods: [
        'eth_sendTransaction',
        'eth_signTransaction',
        'eth_sign',
        'personal_sign',
        'eth_signTypedData',
      ],
      events: ['chainChanged', 'accountsChanged'],
      qrModalOptions: {
        explorerAllowList: [],
        explorerDenyList: [],
        themeVariables: {
          '--w3m-z-index': '999999999',
        },
      },
    }));
  await ethProvider.connect();

  return ethProvider;
}
