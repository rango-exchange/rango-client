import {
  Network,
  WalletType,
  CanSwitchNetwork,
  Connect,
  ProviderConnectResult,
  Subscribe,
  WalletSigners,
  chooseInstance,
  getEvmAccounts,
  subscribeToEvm,
  BlockchainMeta,
  WalletInfo,
  evmBlockchains,
  solanaBlockchain,
} from '@rangodev/wallets-shared';
import {
  getNonEvmAccounts,
  mathWallet as mathWallet_instance,
} from './helpers';
import signer from './signer';

const WALLET = WalletType.MATH;

export const config = {
  type: WALLET,
  // TODO: Get from evm networks
  defaultNetwork: Network.ETHEREUM,
};

export const getInstance = mathWallet_instance;
export const connect: Connect = async ({ instance, meta }) => {
  const ethInstance = chooseInstance(instance, meta, Network.ETHEREUM);

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
    Network.ETHEREUM
  );

  if (ethInstance) {
    subscribeToEvm({ ...options, instance: ethInstance });
  }
};

export const canSwitchNetworkTo: CanSwitchNetwork = () => false;

export const getSigners: (provider: any) => WalletSigners = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  const solana = solanaBlockchain(allBlockChains);
  return {
    name: 'Math Wallet',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/icons/wallets/math.png',
    installLink:
      'https://chrome.google.com/webstore/detail/math-wallet/afbcbjpbpfadlkmhmclhkeeodmamcflc',
    color: '#2b2f25',
    supportedChains: [...evms, ...solana],
  };
};
