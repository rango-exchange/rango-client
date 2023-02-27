import {
  Network,
  WalletType,
  CanSwitchNetwork,
  Connect,
  ProviderConnectResult,
  Subscribe,
  SwitchNetwork,
  WalletSigners,
  canSwitchNetworkToEvm,
  chooseInstance,
  getEvmAccounts,
  switchNetworkForEvm,
  isEvmBlockchain,
  BlockchainMeta,
  WalletInfo,
  evmBlockchains,
  solanaBlockchain,
} from '@rango-dev/wallets-shared';

import { getNonEvmAccounts, clover as clover_instance } from './helpers';

import signer from './signer';

const WALLET = WalletType.CLOVER;

export const config = {
  type: WALLET,
  defaultNetwork: Network.ETHEREUM,
};

export const getInstance = clover_instance;
export const connect: Connect = async ({ instance, meta }) => {
  const ethInstance = chooseInstance(instance, meta, Network.ETHEREUM);

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
  const ethInstance = chooseInstance(instance, meta, Network.ETHEREUM);
  const solanaInstance = chooseInstance(instance, meta, Network.SOLANA);
  ethInstance?.on('accountsChanged', async (addresses: string[]) => {
    if (state.connected) {
      if (!!ethInstance) {
        const eth_chainId = meta
          .filter(isEvmBlockchain)
          .find((blockchain) => blockchain.name === Network.ETHEREUM)?.chainId;
        updateAccounts(addresses, eth_chainId);
      }
      if (!!solanaInstance) {
        const solanaAccount = await solanaInstance.getAccount();
        updateAccounts([solanaAccount], Network.SOLANA);
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

export const getSigners: (provider: any) => WalletSigners = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  const solana = solanaBlockchain(allBlockChains);
  return {
    name: 'Clover',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/icons/wallets/clover.jpeg',
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
