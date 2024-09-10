import type {
  Connect,
  Disconnect,
  ProviderConnectResult,
  WalletInfo,
} from '@rango-dev/wallets-shared';

import { Namespace, Networks, WalletTypes } from '@rango-dev/wallets-shared';
import { type BlockchainMeta, type SignerFactory } from 'rango-types';

import {
  getEthereumAccounts,
  getLedgerInstance,
  getSolanaAccounts,
  transportDisconnect,
} from './helpers.js';
import signer from './signer.js';
import { setDerivationPath } from './state.js';

export const config = {
  type: WalletTypes.LEDGER,
};

export const getInstance = getLedgerInstance;
export const connect: Connect = async ({ namespaces }) => {
  const results: ProviderConnectResult[] = [];

  const solanaNamespace = namespaces?.find(
    (namespaceItem) => namespaceItem.namespace === Namespace.Solana
  );
  const evmNamespace = namespaces?.find(
    (namespaceItem) => namespaceItem.namespace === Namespace.Evm
  );

  if (solanaNamespace) {
    if (solanaNamespace.derivationPath) {
      setDerivationPath(solanaNamespace.derivationPath);
      const accounts = await getSolanaAccounts();
      results.push(accounts);
    } else {
      throw new Error('Derivation Path can not be empty.');
    }
  } else if (evmNamespace) {
    if (evmNamespace.derivationPath) {
      setDerivationPath(evmNamespace.derivationPath);
      const accounts = await getEthereumAccounts();
      results.push(accounts);
    } else {
      throw new Error('Derivation Path can not be empty.');
    }
  } else {
    throw new Error(
      `It appears that you have selected a namespace that is not yet supported by our system. Your namespaces: ${namespaces?.map(
        (namespaceItem) => namespaceItem.namespace
      )}`
    );
  }

  return results;
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
    namespaces: [Namespace.Evm, Namespace.Solana],
    singleNamespace: true,
    showOnMobile: false,
    needsDerivationPath: true,
  };
};
