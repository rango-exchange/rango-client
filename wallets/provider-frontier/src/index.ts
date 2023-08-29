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
  filterBlockchains,
  getEvmAccounts,
  Networks,
  switchNetworkForEvm,
  WalletTypes,
} from '@rango-dev/wallets-shared';

import { frontier as frontier_instance, getSolanaAccounts } from './helpers';
import signer from './signer';

const WALLET = WalletTypes.FRONTIER;

export const config = {
  type: WALLET,
  defaultNetwork: Networks.ETHEREUM,
};

export const getInstance = frontier_instance;
export const connect: Connect = async ({ instance, meta }) => {
  const ethInstance = chooseInstance(instance, meta, Networks.ETHEREUM);
  let results: ProviderConnectResult[] = [];

  if (ethInstance) {
    const evmResult = await getEvmAccounts(ethInstance);
    results.push({
      chainId: evmResult?.chainId,
      accounts: evmResult?.accounts.length > 0 ? [evmResult.accounts[0]] : [],
    });
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
      updateAccounts([account], network);
    } else {
      connect(network);
    }
  });
};
export const switchNetwork: SwitchNetwork = async (options) => {
  const instance = chooseInstance(
    options.instance,
    options.meta,
    options.network
  );
  return switchNetworkForEvm({
    ...options,
    instance,
  });
};

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
    name: 'Frontier',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-assets/main/wallets/frontier/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/frontier-wallet/kppfdiipphfccemcignhifpjkapfbihd',
      BRAVE:
        'https://chrome.google.com/webstore/detail/frontier-wallet/kppfdiipphfccemcignhifpjkapfbihd',
      DEFAULT: 'https://www.frontier.xyz',
    },
    color: '#4d40c6',
    supportedBlockchains: blockchains,
  };
};
