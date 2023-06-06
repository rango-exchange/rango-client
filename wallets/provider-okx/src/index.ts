import {
  Network,
  WalletTypes,
  CanSwitchNetwork,
  Connect,
  ProviderConnectResult,
  Subscribe,
  SwitchNetwork,
  canSwitchNetworkToEvm,
  chooseInstance,
  getEvmAccounts,
  switchNetworkForEvm,
  WalletInfo,
} from '@rango-dev/wallets-shared';

import {
  getSolanaAccounts,
  okx_instance,
  OKX_WALLET_SUPPORTED_CHAINS,
} from './helpers';
import signer from './signer';
import type { SignerFactory, BlockchainMeta } from 'rango-types';

import Rango from 'rango-types';

const { isEvmBlockchain } = Rango;

const WALLET = WalletTypes.OKX;

export const config = {
  type: WALLET,
  defaultNetwork: Network.ETHEREUM,
};

export const getInstance = okx_instance;
export const connect: Connect = async ({ instance, meta }) => {
  let results: ProviderConnectResult[] = [];

  const evm_instance = chooseInstance(instance, meta, Network.ETHEREUM);

  if (evm_instance) {
    const evm = await getEvmAccounts(evm_instance);
    results.push(evm);
  }

  const solanaResults = await getSolanaAccounts(instance);

  results = [...results, ...solanaResults];

  return results;
};

export const subscribe: Subscribe = ({ instance, updateAccounts, meta }) => {
  const ethInstance = chooseInstance(instance, meta, Network.ETHEREUM);

  ethInstance?.on('accountsChanged', async (addresses: string[]) => {
    const eth_chainId = meta
      .filter(isEvmBlockchain)
      .find((blockchain) => blockchain.name === Network.ETHEREUM)?.chainId;

    updateAccounts(addresses, eth_chainId);
    const [{ accounts, chainId }] = await getSolanaAccounts(instance);
    updateAccounts(accounts, chainId);
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

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => ({
  name: 'OKX',
  img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/icons/wallets/okx.png',
  installLink: {
    CHROME:
      'https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge',
    BRAVE:
      'https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge',
    FIREFOX: 'https://addons.mozilla.org/en-US/firefox/addon/okexwallet',
    DEFAULT: 'https://www.okx.com/web3',
  },
  color: 'white',
  supportedChains: allBlockChains.filter((blockchainMeta) =>
    OKX_WALLET_SUPPORTED_CHAINS.includes(blockchainMeta.name as Network)
  ),
});
