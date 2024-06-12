import type { Connect, Disconnect } from '@rango-dev/wallets-core/legacy';
import type { WalletInfo } from '@rango-dev/wallets-shared';

import { Namespaces } from '@rango-dev/wallets-core/namespaces/common';
import { Networks, WalletTypes } from '@rango-dev/wallets-shared';
import { type BlockchainMeta, type SignerFactory } from 'rango-types';

import {
  getEthereumAccounts,
  getLedgerInstance,
  getSolanaAccounts,
  transportDisconnect,
} from './helpers';
import signer from './signer';

export const config = {
  type: WalletTypes.LEDGER,
};

export const getInstance = getLedgerInstance;
export const connect: Connect = async ({ namespaces }) => {
  if (namespaces?.includes(Namespaces.Solana)) {
    return await getSolanaAccounts();
  }
  return await getEthereumAccounts();
};

export const disconnect: Disconnect = async () => {
  void transportDisconnect();
};

export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const supportedChains: BlockchainMeta[] = [];

  const ethereumBlockchain = allBlockChains.find(
    (chain) => chain.name === Networks.ETHEREUM
  );
  if (ethereumBlockchain) {
    supportedChains.push(ethereumBlockchain);
  }

  const solanaBlockchain = allBlockChains.find(
    (chain) => chain.name === Networks.SOLANA
  );
  if (solanaBlockchain) {
    supportedChains.push(solanaBlockchain);
  }

  return {
    name: 'Ledger',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/ledger/icon.svg',
    installLink: {
      DEFAULT:
        'https://support.ledger.com/hc/en-us/articles/4404389606417-Download-and-install-Ledger-Live?docs=true',
    },
    color: 'black',
    supportedChains,
    namespaces: [Namespaces.Evm, Namespaces.Solana],
    singleNamespace: true,
    showOnMobile: false,
  };
};
