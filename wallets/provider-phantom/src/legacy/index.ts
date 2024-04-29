import type { VLegacy } from '@rango-dev/wallets-core';
import type {
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  Subscribe,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import {
  chooseInstance,
  getSolanaAccounts,
  Networks,
} from '@rango-dev/wallets-shared';
import { evmBlockchains, solanaBlockchain } from 'rango-types';

import { WALLET_ID } from '../constants';

import { EVM_SUPPORTED_CHAINS, phantom as phantom_instance } from './helpers';
import signer from './signer';

const config = {
  type: WALLET_ID,
};

const getInstance = phantom_instance;
const connect: Connect = async ({ instance, meta }) => {
  const solanaInstance = instance.get(Networks.SOLANA);
  const result = await getSolanaAccounts({
    instance: solanaInstance,
    meta,
  });

  return result;
};

const subscribe: Subscribe = ({ instance, updateAccounts, connect }) => {
  const handleAccountsChanged = async (publicKey: string) => {
    const network = Networks.SOLANA;
    if (publicKey) {
      const account = publicKey.toString();
      updateAccounts([account]);
    } else {
      connect(network);
    }
  };
  instance?.on('accountChanged', handleAccountsChanged);

  return () => {
    instance?.off('accountChanged', handleAccountsChanged);
  };
};

const canSwitchNetworkTo: CanSwitchNetwork = ({ network }) => {
  return EVM_SUPPORTED_CHAINS.includes(network as Networks);
};

const getSigners: (provider: any) => SignerFactory = signer;

const canEagerConnect: CanEagerConnect = async ({ instance, meta }) => {
  const solanaInstance = chooseInstance(instance, meta, Networks.SOLANA);
  try {
    const result = await solanaInstance.connect({ onlyIfTrusted: true });
    return !!result;
  } catch (error) {
    return false;
  }
};

const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const solana = solanaBlockchain(allBlockChains);
  const evms = evmBlockchains(allBlockChains);

  return {
    name: 'Phantom',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/phantom/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa',

      DEFAULT: 'https://phantom.app/',
    },
    color: '#4d40c6',
    supportedChains: [
      ...solana,
      ...evms.filter((chain) =>
        EVM_SUPPORTED_CHAINS.includes(chain.name as Networks)
      ),
    ],
  };
};

const v0: VLegacy = {
  config,
  getInstance,
  connect,
  subscribe,
  canSwitchNetworkTo,
  getSigners,
  getWalletInfo,
  canEagerConnect,
};

export { v0 };
