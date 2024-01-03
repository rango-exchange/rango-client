import type {
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  ProviderConnectResult,
  Subscribe,
  SwitchNetwork,
  WalletInfo,
} from '@yeager-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import {
  canEagerlyConnectToEvm,
  canSwitchNetworkToEvm,
  chooseInstance,
  getEvmAccounts,
  Networks,
  switchNetworkForEvm,
  WalletTypes,
} from '@yeager-dev/wallets-shared';
import { evmBlockchains, isEvmBlockchain, solanaBlockchain } from 'rango-types';

import { clover as clover_instance, getNonEvmAccounts } from './helpers';
import signer from './signer';

const WALLET = WalletTypes.CLOVER;

export const config = {
  type: WALLET,
  defaultNetwork: Networks.ETHEREUM,
};

export const getInstance = clover_instance;
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

  const nonEvmResults = await getNonEvmAccounts(instance);
  results = [...results, ...nonEvmResults];

  return results;
};

export const subscribe: Subscribe = ({
  instance,
  updateAccounts,
  state,
  meta,
}) => {
  const ethInstance = chooseInstance(instance, meta, Networks.ETHEREUM);
  const solanaInstance = chooseInstance(instance, meta, Networks.SOLANA);
  ethInstance?.on('accountsChanged', async (addresses: string[]) => {
    if (state.connected) {
      if (ethInstance) {
        const eth_chainId = meta
          .filter(isEvmBlockchain)
          .find((blockchain) => blockchain.name === Networks.ETHEREUM)?.chainId;
        updateAccounts(addresses, eth_chainId);
      }
      if (solanaInstance) {
        const solanaAccount = await solanaInstance.getAccount();
        updateAccounts([solanaAccount], Networks.SOLANA);
      }
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

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  const solana = solanaBlockchain(allBlockChains);
  return {
    name: 'Clover',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/clover/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/clover-wallet/nhnkbkgjikgcigadomkphalanndcapjk',
      BRAVE:
        'https://chrome.google.com/webstore/detail/clover-wallet/nhnkbkgjikgcigadomkphalanndcapjk',
      DEFAULT: 'https://wallet.clover.finance',
    },

    color: '#96e7ed',
    supportedChains: [...evms, ...solana],
  };
};
