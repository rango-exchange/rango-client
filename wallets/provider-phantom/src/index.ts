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
  canSwitchNetworkToEvm,
  chooseInstance,
  getEvmAccounts,
  Networks,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import {
  evmBlockchains,
  isEvmBlockchain,
  isSolanaBlockchain,
  solanaBlockchain,
} from 'rango-types';

import { getNonEvmAccounts, phantomInstances } from './helpers';
import signer from './signer';

const WALLET = WalletTypes.PHANTOM;

export const config = {
  type: WALLET,
};

export const getInstance = phantomInstances;

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
  const { connect, updateAccounts, state, updateChainId, meta, instance } =
    options;

  const ethInstance = chooseInstance(instance, meta, Networks.ETHEREUM);
  const solanaInstance = chooseInstance(instance, meta, Networks.SOLANA);

  ethInstance?.on('accountsChanged', (addresses: string[]) => {
    const eth_chainId = meta
      .filter(isEvmBlockchain)
      .find((blockchain) => blockchain.name === Networks.ETHEREUM)?.chainId;
    if (state.connected) {
      if (state.network != Networks.ETHEREUM && eth_chainId) {
        updateChainId(eth_chainId);
      }
      updateAccounts(addresses);
    }
  });

  solanaInstance?.on('accountChanged', async (publicKey: string) => {
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
  });
};

export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;

export const getSigners: (provider: any) => SignerFactory = signer;

export const canEagerConnect: CanEagerConnect = async ({ instance, meta }) => {
  const evm_instance = chooseInstance(instance, meta, Networks.ETHEREUM);
  const solana_instance = chooseInstance(instance, meta, Networks.SOLANA);
  if (evm_instance) {
    return canEagerlyConnectToEvm({ instance: evm_instance, meta });
  }

  if (solana_instance) {
    try {
      const result = await instance.connect({ onlyIfTrusted: true });
      return !!result;
    } catch (error) {
      return false;
    }
  }

  return Promise.resolve(false);
};

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const solana = solanaBlockchain(allBlockChains);
  const evms = evmBlockchains(allBlockChains);

  return {
    name: 'Phantom',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-assets/main/wallets/phantom/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa',

      DEFAULT: 'https://phantom.app/',
    },
    color: '#4d40c6',
    supportedChains: [...evms, ...solana],
  };
};
