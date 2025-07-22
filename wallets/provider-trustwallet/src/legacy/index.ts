import type {
  CanSwitchNetwork,
  Connect,
  Subscribe,
  SwitchNetwork,
  WalletInfo,
} from '@arlert-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import { type LegacyProviderInterface } from '@arlert-dev/wallets-core/legacy';
import {
  canSwitchNetworkToEvm,
  getEvmAccounts,
  subscribeToEvm,
  switchNetworkForEvm,
  WalletTypes,
} from '@arlert-dev/wallets-shared';
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
          getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
            evmBlockchains(allBlockchains),
        },
        {
          label: 'Solana',
          value: 'Solana',
          id: 'SOLANA',
          getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
            solanaBlockchain(allBlockchains),
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
