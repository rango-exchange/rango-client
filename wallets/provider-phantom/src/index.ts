import type {
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  ProviderConnectResult,
  Subscribe,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import {
  chooseInstance,
  getSolanaAccounts,
  Networks,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import { solanaBlockchain, TransactionType } from 'rango-types';

import { getBitcoinAccounts, phantom as phantom_instance } from './helpers';
import signer from './signer';

const WALLET = WalletTypes.PHANTOM;

export const config = {
  type: WALLET,
};

export const getInstance = phantom_instance;
export const connect: Connect = async ({
  instance,
  meta,
  transactionTypes,
}) => {
  const solanaInstance = chooseInstance(instance, meta, Networks.SOLANA);
  const bitcoinInstance = chooseInstance(instance, meta, Networks.BTC);

  const result = [];
  if (solanaInstance && transactionTypes?.includes(TransactionType.SOLANA)) {
    try {
      const solanaAccounts = (await getSolanaAccounts({
        instance: solanaInstance,
        meta,
      })) as ProviderConnectResult;
      result.push(solanaAccounts);
    } catch (error) {
      if (transactionTypes) {
        throw new Error(
          'Could not connect Solana account. Consider adding Solana to your wallet.'
        );
      }
    }
  }

  if (bitcoinInstance && transactionTypes?.includes(TransactionType.TRANSFER)) {
    try {
      const bitcoinAccounts = (await getBitcoinAccounts({
        instance: bitcoinInstance,
        meta,
      })) as ProviderConnectResult;
      result.push(bitcoinAccounts);
    } catch (error) {
      if (transactionTypes) {
        throw new Error(
          'Could not connect Bitcoin account. Consider adding Bitcoin to your wallet.'
        );
      }
    }
  }

  return result;
};

export const subscribe: Subscribe = ({
  instance,
  updateAccounts,
  connect,
  meta,
}) => {
  const solanaInstance = chooseInstance(instance, meta, Networks.SOLANA);

  const handleAccountsChanged = async (publicKey: string) => {
    const network = Networks.SOLANA;
    if (publicKey) {
      const account = publicKey.toString();
      updateAccounts([account]);
    } else {
      connect(network);
    }
  };
  solanaInstance?.on('accountChanged', handleAccountsChanged);

  return () => {
    solanaInstance?.off('accountChanged', handleAccountsChanged);
  };
};

export const canSwitchNetworkTo: CanSwitchNetwork = () => false;

export const getSigners: (provider: any) => SignerFactory = signer;

export const canEagerConnect: CanEagerConnect = async ({ instance, meta }) => {
  const solanaInstance = chooseInstance(instance, meta, Networks.SOLANA);
  const bitcoinInstance = chooseInstance(instance, meta, Networks.BTC);

  try {
    const result = await solanaInstance.connect({ onlyIfTrusted: true });
    if (result) {
      return true;
    }
  } catch (error) {
    /* empty */
  }

  try {
    const result = await bitcoinInstance.requestAccounts();
    if (result) {
      return true;
    }
  } catch (error) {
    /* empty */
  }

  return false;
};

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const solana = solanaBlockchain(allBlockChains);
  const bitcoin = allBlockChains.filter(
    (blockchain) => blockchain.name === Networks.BTC
  );

  return {
    name: 'Phantom',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/phantom/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa',

      DEFAULT: 'https://phantom.app/',
    },
    color: '#4d40c6',
    supportedChains: [...solana, ...bitcoin],
  };
};
