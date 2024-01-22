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
  chooseInstance,
  getEvmAccounts,
  Networks,
  switchNetworkForEvm,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import {
  evmBlockchains,
  isEvmBlockchain,
  isSolanaBlockchain,
  solanaBlockchain,
} from 'rango-types';

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
  const { connect, updateAccounts, state, updateChainId, meta } = options;
  const handleEvmAccountsChanged = (addresses: string[]) => {
    const eth_chainId = meta
      .filter(isEvmBlockchain)
      .find((blockchain) => blockchain.name === Networks.ETHEREUM)?.chainId;
    if (state.connected) {
      if (state.network != Networks.ETHEREUM && eth_chainId) {
        updateChainId(eth_chainId);
      }
      updateAccounts(addresses);
    }
  };

  const handleSolanaAccountsChanged = async (publicKey: string) => {
    if (state.network != Networks.SOLANA) {
      updateChainId(meta.filter(isSolanaBlockchain)[0].chainId);
    }
    const network = Networks.SOLANA;
    if (publicKey) {
      const account = publicKey.toString();
      updateAccounts([account]);
    } else {
      connect(network);
    }
  };
  ethInstance?.on('accountsChanged', handleEvmAccountsChanged);

  solanaInstance?.on('accountChanged', handleSolanaAccountsChanged);

  return () => {
    ethInstance?.off('accountsChanged', handleEvmAccountsChanged);

    solanaInstance?.off('accountChanged', handleSolanaAccountsChanged);
  };
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

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  const solana = solanaBlockchain(allBlockChains);

  return {
    name: 'Frontier',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/frontier/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/frontier-wallet/kppfdiipphfccemcignhifpjkapfbihd',
      BRAVE:
        'https://chrome.google.com/webstore/detail/frontier-wallet/kppfdiipphfccemcignhifpjkapfbihd',
      DEFAULT: 'https://www.frontier.xyz',
    },
    color: '#4d40c6',
    supportedChains: [...evms, ...solana],
  };
};
