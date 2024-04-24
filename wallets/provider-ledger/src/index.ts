import type {
  Connect,
  Disconnect,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import { Networks, WalletTypes } from '@rango-dev/wallets-shared';

import {
  getLedgerAccounts,
  getLedgerInstance,
  transportDisconnect,
} from './helpers';
import signer from './signer';

const WALLET = WalletTypes.LEDGER;

export const config = {
  type: WALLET,
};

export const getInstance = getLedgerInstance;
export const connect: Connect = async () => {
  const ledgerAccounts = await getLedgerAccounts();

  return ledgerAccounts;
};

export const disconnect: Disconnect = async () => {
  void transportDisconnect();
};

export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const ethereumBlockchain = allBlockChains.find(
    (chain) => chain.name === Networks.ETHEREUM
  );
  return {
    name: 'Ledger',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/ledger/icon.svg',
    installLink: {
      DEFAULT:
        'https://support.ledger.com/hc/en-us/articles/4404389606417-Download-and-install-Ledger-Live?docs=true',
    },
    color: 'black',
    supportedChains: ethereumBlockchain ? [ethereumBlockchain] : [],
  };
};
