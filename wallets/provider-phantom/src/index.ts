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
  Namespace,
  Networks,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import { solanaBlockchain } from 'rango-types';

import { getBTCAccounts, phantom as getPhantomInstance } from './helpers.js';
import signer from './signer.js';

const WALLET = WalletTypes.PHANTOM;

export const config = {
  type: WALLET,
};

export const getInstance = getPhantomInstance;

export const connect: Connect = async ({ instance, meta, namespaces }) => {
  const solanaInstance = chooseInstance(instance, meta, Networks.SOLANA);
  const btcInstance = chooseInstance(instance, meta, Networks.BTC);

  const results = [];

  const solanaNamespace = namespaces?.find(
    (namespaceItem) => namespaceItem.namespace === Namespace.Solana
  );
  const utxoNamespace = namespaces?.find(
    (namespaceItem) => namespaceItem.namespace === Namespace.Utxo
  );

  if (!solanaNamespace && !utxoNamespace) {
    throw new Error('You should select one of these namespaces: Solana, BTC');
  }

  if (solanaNamespace) {
    if (!solanaInstance) {
      throw new Error(
        'Could not connect Solana account. Consider adding Solana to your wallet.'
      );
    }

    const accounts = (await getSolanaAccounts({
      instance: solanaInstance,
      meta,
    })) as ProviderConnectResult;
    results.push(accounts);
  }

  if (utxoNamespace) {
    if (!btcInstance) {
      throw new Error(
        'Could not connect BTC account. Consider adding BTC to your wallet.'
      );
    }

    const accounts = (await getBTCAccounts({
      instance: btcInstance,
      meta,
    })) as ProviderConnectResult;
    results.push(accounts);
  }

  return results;
};

export const subscribe: Subscribe = ({ instance, updateAccounts, connect }) => {
  const handleAccountsChanged = async (publicKey: string) => {
    const network = Networks.SOLANA;
    if (publicKey) {
      const account = publicKey.toString();
      updateAccounts([account]);
    } else {
      connect(network);
    }
  };
  instance?.on?.('accountChanged', handleAccountsChanged);

  return () => {
    instance?.off?.('accountChanged', handleAccountsChanged);
  };
};

export const canSwitchNetworkTo: CanSwitchNetwork = () => false;

export const getSigners: (provider: any) => Promise<SignerFactory> = signer;

export const canEagerConnect: CanEagerConnect = async ({ instance }) => {
  try {
    const result = await instance.connect({ onlyIfTrusted: true });
    return !!result;
  } catch (error) {
    return false;
  }
};

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const supportedChains: BlockchainMeta[] = solanaBlockchain(allBlockChains);

  const btc = allBlockChains.find((chain) => chain.name === Networks.BTC);
  if (btc) {
    supportedChains.push(btc);
  }

  return {
    name: 'Phantom',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/phantom/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa',

      DEFAULT: 'https://phantom.app/',
    },
    color: '#4d40c6',
    supportedChains,
    namespaces: [Namespace.Solana, Namespace.Utxo],
  };
};
