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
import { isEvmBlockchain, isSolanaBlockchain } from 'rango-types';

import { EXODUS_WALLET_SUPPORTED_CHAINS } from '../constants.js';
import signer from '../signer.js';
import { exodus } from '../utils.js';

const WALLET = WalletTypes.EXODUS;

export const config = {
  type: WALLET,
  // TODO: Get from evm networks
  defaultNetwork: Networks.ETHEREUM,
};
export const getInstance = exodus;

export const connect: Connect = async ({ instance, meta }) => {
  const evmInstance = chooseInstance(instance, meta, Networks.ETHEREUM);
  const results: ProviderConnectResult[] = [];

  if (evmInstance) {
    const evm = await getEvmAccounts(evmInstance);
    results.push(evm);
  }

  const solanaResults = await getSolanaAccounts(instance);
  results.push(
    ...(Array.isArray(solanaResults) ? solanaResults : [solanaResults])
  );
  return results;
};

export const subscribe: Subscribe = (options) => {
  const ethInstance = chooseInstance(
    options.instance,
    options.meta,
    Networks.ETHEREUM
  );
  const solanaInstance = chooseInstance(
    options.instance,
    options.meta,
    Networks.SOLANA
  );
  const { connect, updateAccounts, state, updateChainId, meta } = options;
  ethInstance?.on?.('accountsChanged', (addresses: string[]) => {
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

  solanaInstance?.on?.('accountChanged', async (publicKey: string) => {
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
  name: 'Exodus',
  img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/exodus/icon.svg',
  installLink: {
    CHROME:
      'https://chrome.google.com/webstore/detail/exodus-web3-wallet/aholpfdialjgjfhomihkjbmgjidlcdno',
    BRAVE:
      'https://chrome.google.com/webstore/detail/exodus-web3-wallet/aholpfdialjgjfhomihkjbmgjidlcdno',
    DEFAULT: 'https://www.exodus.com/',
  },
  color: '#8f70fa',
  supportedChains: allBlockChains.filter((blockchainMeta) =>
    EXODUS_WALLET_SUPPORTED_CHAINS.includes(blockchainMeta.name as Networks)
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
