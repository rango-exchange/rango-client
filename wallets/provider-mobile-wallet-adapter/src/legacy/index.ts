import type { LegacyProviderInterface } from '@rango-dev/wallets-core/legacy';
import type { Connect, WalletInfo } from '@rango-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import { LegacyNetworks as Networks } from '@rango-dev/wallets-core/legacy';
import { chains as solanaChains } from '@rango-dev/wallets-core/namespaces/solana';
import { getSolanaAccounts, WalletTypes } from '@rango-dev/wallets-shared';
import { solanaBlockchain } from 'rango-types';

import signer from '../signers/signer.js';
import {
  mobileWalletAdapter as phantom_instance,
  type Provider,
} from '../utils.js';

const WALLET = WalletTypes.MOBILE_WALLET_ADAPTER;

export const config = {
  type: WALLET,
};

export const getInstance = phantom_instance;

/*
 * NOTE: Phantom's Hub version has support for EVM as well since we are deprecating the legacy,
 * we just want to keep the implementation for some time and then legacy provider will be removed soon.
 * So we don't add new namespaces (like EVM) to legacy.
 */
const connect: Connect = async ({ instance, meta }) => {
  const solanaInstance = instance.get(Networks.SOLANA);
  const result = await getSolanaAccounts({
    instance: solanaInstance,
    meta,
  });

  return result;
};

export const getSigners: (provider: Provider) => Promise<SignerFactory> =
  signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const solana = solanaBlockchain(allBlockChains);

  return {
    name: 'Mobile Wallet Adapter',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/mobile-wallet-adapter/icon.svg',
    installLink: '',
    color: '#4d40c6',
    showOnMobile: true,
    mobileWallet: true,
    showOnDesktop: false,
    // if you are adding a new namespace, don't forget to also update `properties`
    needsNamespace: {
      selection: 'multiple',
      data: [
        {
          label: 'Solana',
          value: 'Solana',
          id: 'SOLANA',
          chains: [solanaChains.solana],
        },
      ],
    },
    supportedChains: [...solana],
  };
};

const buildLegacyProvider: () => LegacyProviderInterface = () => ({
  config,
  getInstance,
  connect,
  getSigners,
  getWalletInfo,
});

export { buildLegacyProvider };
