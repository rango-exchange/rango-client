import type { LegacyProviderInterface } from '@arlert-dev/wallets-core/legacy';
import type { Connect, WalletInfo } from '@arlert-dev/wallets-shared';

import { WalletTypes } from '@arlert-dev/wallets-shared';
import { type BlockchainMeta, type SignerFactory } from 'rango-types';

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

export const getWalletInfo: (
  allBlockChains: BlockchainMeta[]
) => WalletInfo = () => {
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
