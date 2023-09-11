import type {
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  StdBlockchainInfo,
  Subscribe,
  SwitchNetwork,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { SignerFactory } from 'rango-types';

import {
  canEagerlyConnectToEvm,
  canSwitchNetworkToEvm,
  filterBlockchains,
  getEvmAccounts,
  subscribeToEvm,
  switchNetworkForEvm,
  WalletTypes,
} from '@rango-dev/wallets-shared';

import { enkrypt as enkrypt_instance } from './helpers';
import signer from './signer';

export const getInstance = enkrypt_instance;

const WALLET = WalletTypes.ENKRYPT;

export const config = {
  type: WALLET,
};

export const connect: Connect = async ({ instance }) => {
  const result = await getEvmAccounts(instance);
  const { chainId } = result;
  let { accounts } = result;
  if (accounts.length > 1) {
    accounts = [instance.selectedAddress];
  }

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

export const getWalletInfo: (
  allBlockChains: StdBlockchainInfo[]
) => WalletInfo = (allBlockChains) => {
  const blockchains = filterBlockchains(allBlockChains, {
    evm: true,
  });
  return {
    name: 'Enkrypt',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-assets/main/wallets/enkrypt/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/enkrypt/kkpllkodjeloidieedojogacfhpaihoh',
      FIREFOX: 'https://addons.mozilla.org/en-US/firefox/addon/enkrypt/',
      BRAVE:
        'https://chrome.google.com/webstore/detail/enkrypt/kkpllkodjeloidieedojogacfhpaihoh',
      EDGE: 'https://microsoftedge.microsoft.com/addons/detail/enkrypt-ethereum-polkad/gfenajajnjjmmdojhdjmnngomkhlnfjl',

      DEFAULT: 'https://www.enkrypt.com/',
    },
    color: '#fff',
    supportedBlockchains: blockchains,
  };
};
