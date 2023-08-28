import type {
  CanSwitchNetwork,
  Connect,
  ProviderConnectResult,
  Subscribe,
  SwitchNetwork,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import {
  canSwitchNetworkToEvm,
  chooseInstance,
  getEvmAccounts,
  Networks,
  subscribeToEvm,
  switchNetworkForEvm,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import { evmBlockchains, solanaBlockchain } from 'rango-types';

import { getNonEvmAccounts, safepal as safepal_instance } from './helpers';
import signer from './signer';

const WALLET = WalletTypes.SAFEPAL;

export const config = {
  type: WALLET,
  defaultNetwork: Networks.ETHEREUM,
};

export const getInstance = safepal_instance;
export const connect: Connect = async ({ instance, meta }) => {
  const ethInstance = chooseInstance(instance, meta, Networks.ETHEREUM);

  let results: ProviderConnectResult[] = [];

  if (ethInstance) {
    const evmResult = await getEvmAccounts(ethInstance);
    results.push(evmResult);
  }

  const nonEvmResults = await getNonEvmAccounts(instance);
  results = [...results, ...nonEvmResults];

  return results;
};

export const subscribe: Subscribe = (options) => {
  const ethInstance = chooseInstance(
    options.instance,
    options.meta,
    Networks.ETHEREUM
  );

  if (ethInstance) {
    subscribeToEvm({ ...options, instance: ethInstance });
  }
};

export const switchNetwork: SwitchNetwork = switchNetworkForEvm;

export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;

export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  const solana = solanaBlockchain(allBlockChains);
  return {
    name: 'SafePal',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-assets/main/wallets/safepal/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/safepal-extension-wallet/lgmpcpglpngdoalbgeoldeajfclnhafa',
      BRAVE:
        'https://chrome.google.com/webstore/detail/safepal-extension-wallet/lgmpcpglpngdoalbgeoldeajfclnhafa',
      FIREFOX:
        'https://addons.mozilla.org/en-US/firefox/addon/safepal-extension-wallet',
      DEFAULT: 'https://www.safepal.com/download',
    },
    color: '#4A21EF',
    supportedChains: [...evms, ...solana],
  };
};
