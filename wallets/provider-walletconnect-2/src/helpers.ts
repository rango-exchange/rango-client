import { EthereumProvider } from '@walletconnect/ethereum-provider';
import { SessionTypes } from '@walletconnect/types';

const PROJECT_ID = 'f5196d081862c6f2b81c04520ea9301c';

export function supportsForSwitchNetworkRequest(provider: any): boolean {
  const wallets = ['metamask'];
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
  const { chainId = 1, force = false } = options;

  const ethProvider = await EthereumProvider.init({
    projectId: PROJECT_ID, // REQUIRED your projectId
    chains: [chainId],
    // REQUIRED chain ids
    showQrModal: true, // REQUIRED set to "true" to use @web3modal/standalone,
    optionalMethods: [
      'eth_sendTransaction',
      'eth_signTransaction',
      'eth_sign',
      'personal_sign',
      'eth_signTypedData',
      'wallet_switchEthereumChain',
      'wallet_addEthereumChain',
    ],
    events: [
      'chainChanged',
      'accountsChanged',
      'message',
      'connect',
      'disconnect',
    ],
    qrModalOptions: {
      themeVariables: {
        '--w3m-z-index': '999999999',
      },
    },
  });
  const lastIndex =
    ethProvider.signer.client.pairing.getAll({
      active: true,
    }).length - 1;
  const pairingTopic = ethProvider.signer.client.pairing.getAll({
    active: true,
  })[lastIndex]?.topic;

  return new Promise((resolve, reject) => {
    if (pairingTopic && ethProvider.accounts?.length) {
      (async () => {
        await ethProvider.signer.client
          .connect({
            pairingTopic,
            requiredNamespaces: force
              ? {
                  eip155: {
                    methods: [
                      'eth_sendTransaction',
                      'eth_signTransaction',
                      'eth_sign',
                      'personal_sign',
                      'eth_signTypedData',
                    ],
                    chains: [`eip155:${chainId}`],
                    events: ['chainChanged', 'accountsChanged'],
                  },
                }
              : undefined,
          })
          .then(async (res) => {
            if (force) {
              const getAllSessions = ethProvider.signer.client.session.getAll();
              getAllSessions.forEach((session: SessionTypes.Struct) => {
                (ethProvider as any).signer.client.disconnect({
                  topic: session?.topic,
                });
              });
              const { approval } = res;
              await approval();
              ethProvider.signer.setDefaultChain(`eip155:${chainId}`);
            }
            resolve(ethProvider);
          })
          .catch(async () => {
            await ethProvider.disconnect().catch(() => {
              // nothing to do
            });
            await ethProvider
              .connect()
              .then(() => {
                resolve(ethProvider);
              })
              .catch(reject);
          });
      })();
    } else {
      (async () => {
        await ethProvider
          .connect()
          .then(() => {
            resolve(ethProvider);
          })
          .catch(reject);
      })();
    }
  });
}
