import {
  WalletTypes,
  WalletInfo,
  CanSwitchNetwork,
  Connect,
  Subscribe,
  SwitchNetwork,
  canSwitchNetworkToEvm,
  getEvmAccounts,
  subscribeToEvm,
  switchNetworkForEvm,
  CanEagerConnect,
  canEagerlyConnectToEvm,
} from '@rango-dev/wallets-shared';
import { metamask as metamask_instance } from './helpers';
import signer from './signer';
import { SignerFactory, evmBlockchains, BlockchainMeta } from 'rango-types';

const WALLET = WalletTypes.META_MASK;

export const config = {
  type: WALLET,
};

export const getInstance = metamask_instance;
export const connect: Connect = async ({ instance }) => {
  // Note: We need to get `chainId` here, because for the first time
  // after opening the browser, wallet is locked, and don't give us accounts and chainId
  // on `check` phase, so `network` will be null. For this case we need to get chainId
  // whenever we are requesting accounts.
  const { accounts, chainId } = await getEvmAccounts(instance);

  return {
    accounts,
    chainId,
  };
};

export const subscribe: Subscribe = subscribeToEvm;

export const switchNetwork: SwitchNetwork = switchNetworkForEvm;

export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;

export const getSigners: (provider: any) => SignerFactory = signer;

export const canEagerConnect: CanEagerConnect = canEagerlyConnectToEvm;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  return {
    name: 'MetaMask',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/icons/wallets/metamask.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en',
      BRAVE:
        'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en',

      FIREFOX: 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask',
      EDGE: 'https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm?hl=en-US',
      DEFAULT: 'https://metamask.io/download/',
    },
    color: '#dac7ae',
    supportedChains: evms,
  };
};
