import type {
  Connect,
  Disconnect,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import { WalletTypes } from '@rango-dev/wallets-shared';
import { evmBlockchains } from 'rango-types';

import { getLedgerAccounts, getLedgerInstance } from './helpers';
import signer from './signer';

const WALLET = WalletTypes.LEDGER;

export const config = {
  type: WALLET,
};

export const getInstance = getLedgerInstance;
export const connect: Connect = async ({ instance }) => {
  const ledgerAccounts = await getLedgerAccounts(instance);

  return ledgerAccounts;
};

export const disconnect: Disconnect = async ({ instance }) => {
  instance?.transport?.close?.();
};

export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  return {
    name: 'Ledger',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/metamask/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en',
      DEFAULT: 'https://metamask.io/download/',
    },
    color: '#dac7ae',
    supportedChains: evms,
  };
};
