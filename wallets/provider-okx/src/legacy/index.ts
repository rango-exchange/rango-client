import type { LegacyProviderInterface } from '@rango-dev/wallets-core/legacy';
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
import { isEvmBlockchain } from 'rango-types';

import { OKX_WALLET_SUPPORTED_CHAINS } from '../constants.js';
import signer from '../signer.js';
import { okx } from '../utils.js';

const WALLET = WalletTypes.OKX;

export const config = {
  type: WALLET,
  defaultNetwork: Networks.ETHEREUM,
};

export const getInstance = okx;
export const connect: Connect = async ({ instance, meta }) => {
  const results: ProviderConnectResult[] = [];

  const evmInstance = chooseInstance(instance, meta, Networks.ETHEREUM);

  if (evmInstance) {
    const evmResults = await getEvmAccounts(evmInstance);
    results.push(evmResults);
  }

  const solanaResults = await getSolanaAccounts(instance);

  results.push(
    ...(Array.isArray(solanaResults) ? solanaResults : [solanaResults])
  );

  return results;
};

export const subscribe: Subscribe = ({ instance, updateAccounts, meta }) => {
  const ethInstance = chooseInstance(instance, meta, Networks.ETHEREUM);
  const handleEvmAccountsChanged = async (addresses: string[]) => {
    const eth_chainId = meta
      .filter(isEvmBlockchain)
      .find((blockchain) => blockchain.name === Networks.ETHEREUM)?.chainId;

    updateAccounts(addresses, eth_chainId);
    const solanaResults = await getSolanaAccounts(instance);
    const resultsArray = Array.isArray(solanaResults)
      ? solanaResults
      : [solanaResults];

    resultsArray.forEach(({ chainId, accounts }) => {
      updateAccounts(accounts, chainId);
    });
  };
  ethInstance?.on?.('accountsChanged', handleEvmAccountsChanged);

  return () => {
    ethInstance?.off?.('accountsChanged', handleEvmAccountsChanged);
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Provider = any;
export const getSigners: (provider: Provider) => Promise<SignerFactory> =
  signer;

export const canEagerConnect: CanEagerConnect = async ({ instance, meta }) => {
  const evm_instance = chooseInstance(instance, meta, Networks.ETHEREUM);
  if (evm_instance) {
    return canEagerlyConnectToEvm({ instance: evm_instance, meta });
  }
  return Promise.resolve(false);
};

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => ({
  name: 'OKX',
  img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/okx/icon.svg',
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
    OKX_WALLET_SUPPORTED_CHAINS.includes(blockchainMeta.name as Networks)
  ),
});
const buildLegacyProvider: () => LegacyProviderInterface = () => ({
  config,
  getInstance,
  connect,
  subscribe,
  switchNetwork,
  canSwitchNetworkTo,
  getSigners,
  getWalletInfo,
  canEagerConnect,
});

export { buildLegacyProvider };
