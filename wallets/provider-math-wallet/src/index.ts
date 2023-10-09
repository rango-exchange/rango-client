import {
  Networks,
  WalletTypes,
  CanSwitchNetwork,
  Connect,
  ProviderConnectResult,
  Subscribe,
  chooseInstance,
  getEvmAccounts,
  subscribeToEvm,
  WalletInfo,
  CanEagerConnect,
  canEagerlyConnectToEvm,
} from '@rango-dev/wallets-shared';
import {
  getNonEvmAccounts,
  mathWallet as mathWallet_instance,
} from './helpers';
import signer from './signer';
import {
  SignerFactory,
  evmBlockchains,
  solanaBlockchain,
  BlockchainMeta,
} from 'rango-types';

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
  const ethInstance = chooseInstance(
    options.instance,
    options.meta,
    Networks.ETHEREUM
  );

  if (ethInstance) {
    subscribeToEvm({ ...options, instance: ethInstance });
  }
};

export const canSwitchNetworkTo: CanSwitchNetwork = () => false;

export const getSigners: (provider: any) => SignerFactory = signer;

export const canEagerConnect: CanEagerConnect = ({ instance, meta }) => {
  const evm_instance = chooseInstance(instance, meta, Networks.ETHEREUM);
  if (evm_instance) {
    return canEagerlyConnectToEvm({ instance: evm_instance, meta });
  } else return Promise.resolve(false);
};
export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  const solana = solanaBlockchain(allBlockChains);
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
    supportedChains: [...evms, ...solana],
  };
};
