import type {
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  ProviderConnectResult,
  Subscribe,
  SwitchNetwork,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import {
  canEagerlyConnectToEvm,
  canSwitchNetworkToEvm,
  subscribeToEvm,
  switchNetworkForEvm,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import { starknetBlockchain } from 'rango-types';

import {
  installStarknetSnap,
  isStarknetSnapInstalled,
  metamask as metamask_instance,
  recoverAccounts,
} from './helpers';
import signer from './signer';

const WALLET = WalletTypes.STARKNET_SNAP;

export const config = {
  type: WALLET,
};

export const getInstance = metamask_instance;
export const connect: Connect = async ({ instance, meta }) => {
  /*
   *  cosmos snap (It's optional)
   * If the user approves to install Snap, we take the Cosmos addresses and add them to the accounts.
   */
  await installStarknetSnap(instance);
  const installed = await isStarknetSnapInstalled(instance);
  let accounts: ProviderConnectResult[] = [];
  if (installed) {
    for (const item of meta) {
      const addresses = await recoverAccounts(instance, item.chainId || '');
      accounts = [
        ...accounts,
        ...addresses.map((item) => ({
          accounts: [item.address],
          chainId: item.chainId,
        })),
      ];
    }
  }
  console.log({ accounts });

  return accounts;
};

export const subscribe: Subscribe = subscribeToEvm;

export const switchNetwork: SwitchNetwork = switchNetworkForEvm;

export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;

export const getSigners: (provider: any) => SignerFactory = signer;

export const canEagerConnect: CanEagerConnect = canEagerlyConnectToEvm;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const starknet = starknetBlockchain(allBlockChains);
  return {
    name: 'Starknet Snap',
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
    supportedChains: starknet,
  };
};
