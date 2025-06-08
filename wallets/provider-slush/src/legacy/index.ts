import type { LegacyProviderInterface } from '@rango-dev/wallets-core/legacy';
import type { Connect, WalletInfo } from '@rango-dev/wallets-shared';

import { WalletTypes } from '@rango-dev/wallets-shared';
import {
  type BlockchainMeta,
  type SignerFactory,
  type SuiBlockchainMeta,
  TransactionType,
} from 'rango-types';

import { suiWalletInstance } from '../utils.js';

import signer from './signer.js';

const WALLET = WalletTypes.SLUSH;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Provider = any;

export const config = {
  type: WALLET,
};

export const getInstance = suiWalletInstance;

const connect: Connect = async () => {
  throw new Error('not implemented');
};

export const getSigners: (provider: Provider) => Promise<SignerFactory> =
  signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const sui = allBlockChains.filter(
    (blockchain) => blockchain.type === TransactionType.SUI
  );

  return {
    name: 'Slush',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/slush/icon.svg',
    installLink: {
      CHROME:
        'https://chromewebstore.google.com/detail/slush-%E2%80%94-a-sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil',
      DEFAULT: 'https://slush.app/download',
    },
    color: '#4d40c6',
    // if you are adding a new namespace, don't forget to also update `properties`
    needsNamespace: {
      selection: 'multiple',
      data: [
        {
          label: 'Sui',
          value: 'Sui',
          id: 'SUI',
          getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
            allBlockchains.filter(
              (chain): chain is SuiBlockchainMeta =>
                chain.type === TransactionType.SUI
            ),
        },
      ],
    },
    supportedChains: sui,
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
