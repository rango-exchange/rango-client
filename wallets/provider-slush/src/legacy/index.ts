import type { LegacyProviderInterface } from '@rango-dev/wallets-core/legacy';
import type { Connect, WalletInfo } from '@rango-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import { WalletTypes } from '@rango-dev/wallets-shared';

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

const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = () => {
  throw new Error('not implemented');
};

const buildLegacyProvider: () => LegacyProviderInterface = () => ({
  config,
  getInstance,
  connect,
  getSigners,
  getWalletInfo,
});

export { buildLegacyProvider };
