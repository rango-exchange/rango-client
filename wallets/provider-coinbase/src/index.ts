import type {
  BlockchainInfo,
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  ProviderConnectResult,
  Subscribe,
  SwitchNetwork,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { SignerFactory } from 'rango-types';

import {
  canEagerlyConnectToEvm,
  canSwitchNetworkToEvm,
  chooseInstance,
  getCoinbaseInstance as coinbase_instance,
  filterBlockchains,
  getEvmAccounts,
  Networks,
  switchNetworkForEvm,
  WalletTypes,
} from '@rango-dev/wallets-shared';

import { getSolanaAccounts } from './helpers';
import signer from './signer';

const WALLET = WalletTypes.COINBASE;

export const config = {
  type: WALLET,
  defaultNetwork: Networks.ETHEREUM,
};

export const getInstance = coinbase_instance;
export const connect: Connect = async ({ instance, meta }) => {
  /*
   * Note: We need to get `chainId` here, because for the first time
   * after opening the browser, wallet is locked, and don't give us accounts and chainId
   * on `check` phase, so `network` will be null. For this case we need to get chainId
   * whenever we are requesting accounts.
   */
  const evm_instance = chooseInstance(instance, meta, Networks.ETHEREUM);
  let results: ProviderConnectResult[] = [];

  if (evm_instance) {
    const evm = await getEvmAccounts(evm_instance);
    results.push(evm);
  }

  const solanaResults = await getSolanaAccounts(instance);
  results = [...results, ...solanaResults];
  return results;
};

export const subscribe: Subscribe = (options) => {
  const ethInstance = chooseInstance(
    options.instance,
    options.meta,
    Networks.ETHEREUM
  );
  const solanaInstance = chooseInstance(
    options.instance,
    options.meta,
    Networks.SOLANA
  );
  const { connect, updateAccounts, state } = options;
  ethInstance?.on('accountsChanged', (addresses: string[]) => {
    if (state.connected) {
      updateAccounts(addresses, Networks.ETHEREUM);
    }
  });

  solanaInstance?.on('accountChanged', async (publicKey: string) => {
    const network = Networks.SOLANA;
    if (publicKey) {
      const account = publicKey.toString();
      updateAccounts([account], Networks.SOLANA);
    } else {
      connect(network);
    }
  });
};
export const switchNetwork: SwitchNetwork = switchNetworkForEvm;

export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;

export const getSigners: (provider: any) => SignerFactory = signer;

export const canEagerConnect: CanEagerConnect = async ({ instance, meta }) => {
  const evm_instance = chooseInstance(instance, meta, Networks.ETHEREUM);
  if (evm_instance) {
    return canEagerlyConnectToEvm({ instance: evm_instance, meta });
  }
  return Promise.resolve(false);
};

export const getWalletInfo: (allBlockChains: BlockchainInfo[]) => WalletInfo = (
  allBlockChains
) => {
  const blockchains = filterBlockchains(allBlockChains, {
    evm: true,
    ids: [Networks.SOLANA],
  });
  return {
    name: 'Coinbase',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-assets/main/wallets/coinbase/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad',
      BRAVE:
        'https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad',
      DEFAULT: 'https://www.coinbase.com/wallet',
    },
    color: '#2a62f5',
    supportedBlockchains: blockchains,
  };
};
