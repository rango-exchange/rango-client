import {
  Network,
  WalletType,
  CanSwitchNetwork,
  Connect,
  Subscribe,
  WalletSigners,
  BlockchainMeta,
  WalletInfo,
  starknetBlockchain,
} from '@rangodev/wallets-shared';
import { argentx as argentx_instances } from './helpers';
import signer from './signer';

// https://www.starknetjs.com/docs/API/signer
// https://github.com/apibara/starknet-react
// https://github.com/0xs34n/starknet.js
// https://github.com/argentlabs/argent-x#-usage-with-your-dapp

const WALLET = WalletType.ARGENTX;
const MAINNET_CHAIN_ID = 'SN_MAIN';

export const config = {
  type: WALLET,
  defaultNetwork: Network.STARKNET,
};

export const getInstance = argentx_instances;

export const connect: Connect = async ({ instance }) => {
  let r = undefined;
  r = await instance?.enable();
  if (!r || !instance.isConnected || r?.length === 0) {
    throw new Error('Error connecting ArgentX');
  }
  if (instance?.chainId !== MAINNET_CHAIN_ID)
    throw new Error(
      `Please switch to Mainnet, current network is ${instance?.chainId}`
    );
  return { accounts: !!r ? r : [], chainId: Network.STARKNET };
};

export const subscribe: Subscribe = ({ instance, state, updateAccounts }) => {
  instance?.on('accountsChanged', (accounts: any) => {
    if (state.connected) {
      if (!!instance) {
        updateAccounts(accounts, Network.STARKNET);
      }
    }
  });
};

export const canSwitchNetworkTo: CanSwitchNetwork = () => false;

export const getSigners: (provider: any) => WalletSigners = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const starknet = starknetBlockchain(allBlockChains);
  return {
    name: 'ArgentX',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/icons/wallets/argentx.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/argent-x/dlcobpjiigpikoobohmabehhmhfoodbb',
      FIREFOX: 'https://addons.mozilla.org/en-GB/firefox/addon/argent-x',
    },

    color: '#96e7ed',
    supportedChains: starknet,
  };
};
