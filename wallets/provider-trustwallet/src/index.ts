import type {
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  Subscribe,
  SwitchNetwork,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import {
  canEagerlyConnectToEvm,
  canSwitchNetworkToEvm,
  getEvmAccounts,
  subscribeToEvm,
  switchNetworkForEvm,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import { evmBlockchains } from 'rango-types';

import { trustWallet as trustwallet_instance } from './helpers';
import signer from './signer';

const WALLET = WalletTypes.TRUST_WALLET;

export const config = {
  type: WALLET,
};

export const getInstance = trustwallet_instance;

// doc: https://developer.trustwallet.com/trust-wallet-browser-extension/extension-guide
export const connect: Connect = async ({ instance }) => {
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
    name: 'Trust Wallet',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/trustwallet/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph/',
      BRAVE:
        'https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph/',
      DEFAULT: 'https://trustwallet.com/browser-extension',
    },
    color: '#ffffff',
    supportedChains: evms,
  };
};
