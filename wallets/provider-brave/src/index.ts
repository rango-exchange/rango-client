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
  getSolanaAccounts,
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

import { brave as brave_instances } from './helpers.js';
import signer from './signer.js';

const WALLET = WalletTypes.BRAVE;

export const config = {
  type: WALLET,
  defaultNetwork: Networks.ETHEREUM,
};

export const getInstance = brave_instances;

export const connect: Connect = async ({ instance, meta }) => {
  const evm_instance = chooseInstance(instance, meta, Networks.ETHEREUM);
  const sol_instance = chooseInstance(instance, meta, Networks.SOLANA);
  const results: ProviderConnectResult[] = [];
  const emptyWalletErrorCode = -32603;
  const emptyWalletCustomErrorMessage = 'Please create or import a wallet';
  let numberOfEmptyWallets = 0;

  if (evm_instance) {
    try {
      const evmAccounts = await getEvmAccounts(evm_instance);
      results.push(evmAccounts);
    } catch (error) {
      // To resolve this error: Catch clause variable type annotation must be any or unknown if specified
      const err = error as { code: number };
      if (err.code === emptyWalletErrorCode) {
        numberOfEmptyWallets += 1;
      } else {
        throw error;
      }
    }
  }

  if (sol_instance) {
    try {
      const solanaAccounts = await getSolanaAccounts({
        instance: sol_instance,
        meta,
      });
      results.push(solanaAccounts as ProviderConnectResult);
    } catch (error) {
      // To resolve this error: Catch clause variable type annotation must be any or unknown if specified
      const err = error as { code: number };
      if (err.code === emptyWalletErrorCode) {
        numberOfEmptyWallets += 1;
      } else {
        throw error;
      }
    }
  }

  if (numberOfEmptyWallets === instance.size) {
    throw new Error(emptyWalletCustomErrorMessage);
  }

  return results;
};

export const subscribe: Subscribe = ({
  instance,
  updateAccounts,
  meta,
  state,
  updateChainId,
}) => {
  const evm_instance = chooseInstance(instance, meta, Networks.ETHEREUM);
  const sol_instance = chooseInstance(instance, meta, Networks.SOLANA);

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

  const handleEvmChainChanged = (chainId: string) => {
    updateChainId(chainId);
  };

  const handleSolanaAccountsChanged = async () => {
    if (state.network != Networks.SOLANA) {
      updateChainId(meta.filter(isSolanaBlockchain)[0].chainId);
    }
    const response = await sol_instance.connect();
    const account: string = response.publicKey.toString();
    updateAccounts([account]);
  };

  evm_instance?.on?.('accountsChanged', handleEvmAccountsChanged);

  evm_instance?.on?.('chainChanged', handleEvmChainChanged);

  sol_instance?.on?.('accountChanged', handleSolanaAccountsChanged);

  return () => {
    evm_instance?.off?.('accountsChanged', handleEvmAccountsChanged);

    evm_instance?.off?.('chainChanged', handleEvmChainChanged);

    sol_instance?.off?.('accountChanged', handleSolanaAccountsChanged);
  };
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

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  const solana = solanaBlockchain(allBlockChains);
  return {
    name: 'Brave',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/brave/icon.svg',
    installLink: {
      DEFAULT: 'https://brave.com/wallet/',
    },
    color: '#ef342f',
    supportedChains: [...evms, ...solana],
  };
};
