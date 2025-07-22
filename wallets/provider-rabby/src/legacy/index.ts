import type {
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  Subscribe,
  SwitchNetwork,
  WalletInfo,
} from '@arlert-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import { type LegacyProviderInterface } from '@arlert-dev/wallets-core/legacy';
import {
  canEagerlyConnectToEvm,
  canSwitchNetworkToEvm,
  getEvmAccounts,
  subscribeToEvm,
  switchNetworkForEvm,
  WalletTypes,
} from '@arlert-dev/wallets-shared';
import { evmBlockchains } from 'rango-types';

import { type Provider, rabby as rabbyInstance } from '../utils.js';

import signer from './signer.js';

export const config = {
  type: WalletTypes.Rabby,
};

export const getInstance = rabbyInstance;
export const connect: Connect = async ({ instance }) => {
  /*
   * Note: We need to get `chainId` here, because for the first time
   * after opening the browser, wallet is locked, and don't give us accounts and chainId
   * on `check` phase, so `network` will be null. For this case we need to get chainId
   * whenever we are requesting accounts.
   */
  const { accounts, chainId } = await getEvmAccounts(instance);

  return {
    accounts,
    chainId,
  };
};

export const subscribe: Subscribe = subscribeToEvm;

export const switchNetwork: SwitchNetwork = switchNetworkForEvm;

export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;

export const getSigners: (provider: Provider) => Promise<SignerFactory> =
  signer;

export const canEagerConnect: CanEagerConnect = canEagerlyConnectToEvm;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  return {
    name: 'Rabby',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/rabby/icon.svg',
    installLink: {
      CHROME:
        'https://chromewebstore.google.com/detail/rabby-wallet/acmacodkjbdgmoleebolmdjonilkdbch',
      BRAVE:
        'https://chromewebstore.google.com/detail/rabby-wallet/acmacodkjbdgmoleebolmdjonilkdbch',
      FIREFOX: 'https://addons.mozilla.org/en-US/firefox/addon/rabby-wallet/',
      DEFAULT: 'https://rabby.io/',
    },
    color: '#fff',
    supportedChains: evms,
    needsNamespace: {
      selection: 'multiple',
      data: [
        {
          id: 'ETH',
          value: 'EVM',
          label: 'Evm',
          getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
            evmBlockchains(allBlockchains),
        },
      ],
    },
  };
};

const buildLegacyProvider: () => LegacyProviderInterface = () => ({
  config,
  getInstance,
  connect,
  subscribe,
  switchNetwork,
  canSwitchNetworkTo,
  getSigners,
  canEagerConnect,
  getWalletInfo,
});

export { buildLegacyProvider };
