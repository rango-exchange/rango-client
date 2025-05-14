import type {
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
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
  canEagerlyConnectToEvm as canEagerlyConnectToEvm,
  canSwitchNetworkToEvm,
  chooseInstance,
  getEvmAccounts,
  subscribeToEvm,
  switchNetworkForEvm,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import { evmBlockchains, solanaBlockchain } from 'rango-types';

import {
  type Provider,
  trustWallet as trustwallet_instance,
} from '../utils.js';

import signer from './signer.js';

const WALLET = WalletTypes.TRUST_WALLET;

export const config = {
  type: WALLET,
};

export const getInstance = trustwallet_instance;

// doc: https://developer.trustwallet.com/trust-wallet-browser-extension/extension-guide
export const connect: Connect = async ({ instance }) => {
  const { accounts, chainId } = await getEvmAccounts(instance);
  return {
    accounts,
    chainId,
  };
};

export const subscribe: Subscribe = subscribeToEvm;

export const switchNetwork: SwitchNetwork = switchNetworkForEvm;

export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;

export const getSigners: (provider: Provider) => Promise<SignerFactory> =
  signer;

export const canEagerConnect: CanEagerConnect = async ({ instance, meta }) => {
  const evm_instance = chooseInstance(instance, meta, Networks.ETHEREUM);
  if (evm_instance) {
    return canEagerlyConnectToEvm({
      instance: evm_instance,
      meta,
    });
  }
  return Promise.resolve(false);
};

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  const solana = solanaBlockchain(allBlockChains);

  return {
    name: 'Trust Wallet',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/trustwallet/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph',
      BRAVE:
        'https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph',
      DEFAULT: 'https://trustwallet.com/browser-extension',
    },
    color: '#ffffff',
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
  canSwitchNetworkTo,
  getSigners,
  getWalletInfo,
  canEagerConnect,
});

export { buildLegacyProvider };
