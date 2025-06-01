import type {
  CanSwitchNetwork,
  Connect,
  ProviderConnectResult,
  Subscribe,
  SwitchNetwork,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import {
  type LegacyProviderInterface,
  LegacyNetworks as Networks,
} from '@rango-dev/wallets-core/legacy';
import {
  canSwitchNetworkToEvm,
  chooseInstance,
  getEvmAccounts,
  subscribeToEvm,
  switchNetworkForEvm,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import { evmBlockchains, solanaBlockchain } from 'rango-types';

import {
  getSolanaAccounts as getNonEvmAccounts,
  safepal as safepal_instance,
  solanaSafepal,
} from '../utils.js';

import signer from './signer.js';

const WALLET = WalletTypes.SAFEPAL;

export const config = {
  type: WALLET,
  defaultNetwork: Networks.ETHEREUM,
};

export const getInstance = safepal_instance;
export const connect: Connect = async ({ instance, meta }) => {
  const ethInstance = chooseInstance(instance, meta, Networks.ETHEREUM);

  const results: ProviderConnectResult[] = [];

  if (ethInstance) {
    const evmResult = await getEvmAccounts(ethInstance);
    results.push(evmResult);
  }

  const solanaInstance = solanaSafepal();
  if (solanaInstance) {
    const solanaResults = await getNonEvmAccounts(solanaInstance);
    results.push(solanaResults);
  }
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

export const switchNetwork: SwitchNetwork = switchNetworkForEvm;

export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Provider = any;
export const getSigners: (provider: Provider) => Promise<SignerFactory> =
  signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  const solana = solanaBlockchain(allBlockChains);
  return {
    name: 'SafePal',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/safepal/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/safepal-extension-wallet/lgmpcpglpngdoalbgeoldeajfclnhafa',
      BRAVE:
        'https://chrome.google.com/webstore/detail/safepal-extension-wallet/lgmpcpglpngdoalbgeoldeajfclnhafa',
      FIREFOX:
        'https://addons.mozilla.org/en-US/firefox/addon/safepal-extension-wallet',
      DEFAULT: 'https://www.safepal.com/download',
    },
    color: '#4A21EF',
    supportedChains: [...evms, ...solana],
    needsNamespace: {
      selection: 'multiple',
      data: [
        {
          label: 'EVM',
          value: 'EVM',
          id: 'ETH',
        },
        {
          label: 'Solana',
          value: 'Solana',
          id: 'SOLANA',
        },
      ],
    },
  };
};

const buildLegacyProvider: () => LegacyProviderInterface = () => ({
  config,
  getInstance,
  connect,
  subscribe,
  switchNetwork,
  canSwitchNetworkTo,
  getSigners,
  getWalletInfo,
});

export { buildLegacyProvider };
