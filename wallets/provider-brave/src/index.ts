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
  getSolanaAccounts,
  Networks,
  switchNetworkForEvm,
  WalletTypes,
} from '@rango-dev/wallets-shared';

import { brave as brave_instances } from './helpers';
import signer from './signer';

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

  evm_instance?.on('accountsChanged', (addresses: string[]) => {
    if (state.connected) {
      updateAccounts(addresses, Networks.ETHEREUM);
    }
  });

  evm_instance?.on('chainChanged', (chainId: string) => {
    updateChainId(chainId);
  });

  sol_instance?.on('accountChanged', async () => {
    const response = await sol_instance.connect();
    const account: string = response.publicKey.toString();
    updateAccounts([account], Networks.SOLANA);
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
    name: 'Brave',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-assets/main/wallets/brave/icon.svg',
    installLink: {
      DEFAULT: 'https://brave.com/wallet/',
    },
    color: '#ef342f',
    supportedBlockchains: blockchains,
  };
};
