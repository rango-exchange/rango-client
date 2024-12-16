import type { LegacyProviderInterface } from '@rango-dev/wallets-core/legacy';
import type {
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  Subscribe,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type {
  BlockchainMeta,
  EvmBlockchainMeta,
  SignerFactory,
} from 'rango-types';

import { LegacyNetworks as Networks } from '@rango-dev/wallets-core/legacy';
import {
  chooseInstance,
  getSolanaAccounts,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import { isEvmBlockchain, solanaBlockchain } from 'rango-types';

import { EVM_SUPPORTED_CHAINS } from '../constants.js';
import { phantom as phantom_instance } from '../utils.js';

import signer from './signer.js';

const WALLET = WalletTypes.PHANTOM;

export const config = {
  type: WALLET,
};

export const getInstance = phantom_instance;

/*
 * NOTE: Phantom's Hub version has support for EVM as well since we are deprecating the legacy,
 * we just want to keep the implementation for some time and then legacy provider will be removed soon.
 * So we don't add new namespaces (like EVM) to legacy.
 */
const connect: Connect = async ({ instance, meta }) => {
  const solanaInstance = instance.get(Networks.SOLANA);
  const result = await getSolanaAccounts({
    instance: solanaInstance,
    meta,
  });

  return result;
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

const canSwitchNetworkTo: CanSwitchNetwork = ({ network }) => {
  return EVM_SUPPORTED_CHAINS.includes(network as Networks);
};

export const getSigners: (provider: any) => Promise<SignerFactory> = signer;

const canEagerConnect: CanEagerConnect = async ({ instance, meta }) => {
  const solanaInstance = chooseInstance(instance, meta, Networks.SOLANA);
  try {
    const result = await solanaInstance.connect({ onlyIfTrusted: true });
    return !!result;
  } catch (error) {
    return false;
  }
};
export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const solana = solanaBlockchain(allBlockChains);
  const evms = allBlockChains.filter(
    (chain): chain is EvmBlockchainMeta =>
      isEvmBlockchain(chain) &&
      EVM_SUPPORTED_CHAINS.includes(chain.name as Networks)
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
    // if you are adding a new namespace, don't forget to also update `properties`
    supportedChains: [
      ...solana,
      ...evms.filter((chain) =>
        EVM_SUPPORTED_CHAINS.includes(chain.name as Networks)
      ),
    ],

    needsNamespace: {
      selection: 'multiple',
      data: [
        {
          label: 'EVM',
          value: 'EVM',
          id: 'ETH',
        },
        {
          label: 'Solana',
          value: 'Solana',
          id: 'SOLANA',
        },
      ],
    },
  };
};

const legacyProvider: LegacyProviderInterface = {
  config,
  getInstance,
  connect,
  subscribe,
  canSwitchNetworkTo,
  getSigners,
  getWalletInfo,
  canEagerConnect,
};

export { legacyProvider };
