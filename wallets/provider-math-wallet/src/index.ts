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
  chooseInstance,
  getEvmAccounts,
  Networks,
  subscribeToEvm,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import {
  cosmosBlockchains,
  evmBlockchains,
  solanaBlockchain,
} from 'rango-types';

import {
  getNonEvmAccounts,
  mathWallet as mathWallet_instance,
} from './helpers';
import signer from './signer';

const WALLET = WalletTypes.MATH;

export const config = {
  type: WALLET,
  defaultNetwork: Networks.ETHEREUM,
};

export const getInstance = mathWallet_instance;
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
  let cleanup: ReturnType<Subscribe>;
  const ethInstance = chooseInstance(
    options.instance,
    options.meta,
    Networks.ETHEREUM
  );

  if (ethInstance) {
    cleanup = subscribeToEvm({ ...options, instance: ethInstance });
  }

  return () => {
    if (cleanup) {
      cleanup();
    }
  };
};

export const canSwitchNetworkTo: CanSwitchNetwork = () => false;

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
  const cosmos = cosmosBlockchains(allBlockChains);
  return {
    name: 'Math Wallet',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/math/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/math-wallet/afbcbjpbpfadlkmhmclhkeeodmamcflc',
      BRAVE:
        'https://chrome.google.com/webstore/detail/math-wallet/afbcbjpbpfadlkmhmclhkeeodmamcflc',
      DEFAULT: 'https://mathwallet.org/en-us/',
    },
    color: '#2b2f25',
    supportedChains: [...evms, ...solana, ...cosmos],
  };
};
