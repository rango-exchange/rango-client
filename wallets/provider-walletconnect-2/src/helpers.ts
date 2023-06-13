import UniversalProvider from '@walletconnect/universal-provider';
import { Web3Modal } from '@web3modal/standalone';
const PROJECT_ID = 'f5196d081862c6f2b81c04520ea9301c';
const CHAINS = [1, 56];

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

// export async function makeConnection(options: {
//   chainId?: string;
// }): Promise<any> {
//   const { chainId } = options;

//   // const ethProvider = await EthereumProvider.init({
//   //   projectId, // REQUIRED your projectId
//   //   chains: [chainId],
//   //   // REQUIRED chain ids
//   //   showQrModal: true, // REQUIRED set to "true" to use @web3modal/standalone,
//   //   optionalMethods: [
//   //     'eth_sendTransaction',
//   //     'eth_signTransaction',
//   //     'eth_sign',
//   //     'personal_sign',
//   //     'eth_signTypedData',
//   //     'wallet_switchEthereumChain',
//   //     'wallet_addEthereumChain',
//   //   ],
//   //   events: [
//   //     'chainChanged',
//   //     'accountsChanged',
//   //     'message',
//   //     'connect',
//   //     'disconnect',
//   //   ],
//   //   qrModalOptions: {
//   //     // explorerAllowList: [],
//   //     // explorerDenyList: [],
//   //     themeVariables: {
//   //       '--w3m-z-index': '999999999',
//   //     },
//   //   },
//   // });

//   const provider = await UniversalProvider.init({
//     projectId,
//     logger: 'debug',
//     relayUrl: 'wss://relay.walletconnect.com',
//   });
//   console.log('here 57', provider);

//   const web3Modal = new Web3Modal({
//     projectId,
//     walletConnectVersion: 2,
//   });
//   web3Modal.openModal({ uri: provider.uri });
//   // await provider.enable().catch(console.log);

//   console.log('here 61');

//   // const lastIndex =
//   //   cosmosProvider.signer.client.pairing.getAll({
//   //     active: true,
//   //   }).length - 1;
//   // const pairingTopic  13-06-2023= cosmosProvider.signer.client.pairing.getAll({
//   //   active: true,
//   // })[lastIndex]?.topic;

//   return new Promise((resolve, reject) => {
//     (async () => {
//       console.log('74');

//       await provider
//         .connect({
//           namespaces: {
//             cosmos: {
//               methods: DEFAULT_COSMOS_METHODS,
//               chains: chainId ? [chainId] : [],
//               events: ['chainChanged', 'accountsChanged'],
//             },
//           },
//         })
//         .then(() => {
//           console.log('here 85');

//           resolve(provider);
//         })
//         .catch(reject);
//     })();
//   });
// }

// import { ethers } from "ethers";
import UniversalProvider from '@walletconnect/universal-provider';
import { Web3Modal } from '@web3modal/standalone';
const PROJECT_ID = 'f5196d081862c6f2b81c04520ea9301c';

const walletConnectModal = new Web3Modal({
  projectId: PROJECT_ID,
  walletConnectVersion: 2,
  themeVariables: {
    '--w3m-z-index': '999999999',
  },
});
const relayUrl = 'wss://relay.walletconnect.com';

export async function makeConnection(options: {
  chainId?: number;
  force?: boolean;
}): Promise<any> {
  const { chainId = 1, force = false } = options;
  const filteredChains = CHAINS.filter((chain) => chain !== chainId);
  const filteredEIPChains = filteredChains.map((chain) => `eip155:${chain}`);

  const provider = await UniversalProvider.init({
    relayUrl,
    projectId: PROJECT_ID,
  });

  provider.on('display_uri', (uri: string) => {
    walletConnectModal.openModal({ uri });
  });
  const lastIndex =
    provider.client.pairing.getAll({
      active: true,
    }).length - 1;
  const pairingTopic = provider.client.pairing.getAll({
    active: true,
  })[lastIndex]?.topic;

  //  create sub providers for each namespace/chain
  try {
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
          chains: [`eip155:${chainId}`].concat(filteredEIPChains),
          events: ['chainChanged', 'accountsChanged'],
          // rpcMap: {
          //   [chainId]: `https://rpc.walletconnect.com?chainId=eip155:${chainId}&projectId=f5196d081862c6f2b81c04520ea9301c`,
          // },
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
