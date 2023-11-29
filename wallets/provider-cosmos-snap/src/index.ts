import type {
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  ProviderConnectResult,
  Subscribe,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import {
  canEagerlyConnectToEvm,
  subscribeToEvm,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import { cosmosBlockchains } from 'rango-types';

import {
  getAddresses,
  installCosmosSnap,
  isCosmosSnapInstalled,
  metamask as metamask_instance,
} from './helpers';
import signer from './signer';

const WALLET = WalletTypes.COSMOS_SNAP;

export const config = {
  type: WALLET,
};

export const getInstance = metamask_instance;
export const connect: Connect = async ({ instance }) => {
  /*
   *  cosmos snap (It's optional)
   * If the user approves to install Snap, we take the Cosmos addresses and add them to the accounts.
   */
  await installCosmosSnap(instance);
  const installed = await isCosmosSnapInstalled(instance);
  let accounts: ProviderConnectResult[] = [];
  if (installed) {
    const addresses = await getAddresses(instance);
    accounts = addresses.map((item) => ({
      accounts: [item.address],
      chainId: item.chain_id,
    }));
  }
  if (!accounts.length) {
    throw new Error('You have rejected to install cosmos-snap');
  }
  return accounts;
};

export const subscribe: Subscribe = subscribeToEvm;

export const canSwitchNetworkTo: CanSwitchNetwork = () => false;

export const getSigners: (provider: any) => SignerFactory = signer;

export const canEagerConnect: CanEagerConnect = canEagerlyConnectToEvm;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const cosmos = cosmosBlockchains(allBlockChains);
  return {
    name: 'Cosmos Snap',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/metamask/icon.svg',
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
    supportedChains: cosmos,
  };
};
