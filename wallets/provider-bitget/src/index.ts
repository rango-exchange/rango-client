import type {
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  ProviderConnectResult,
  Subscribe,
  SwitchNetwork,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import {
  canEagerlyConnectToEvm,
  canSwitchNetworkToEvm,
  chooseInstance,
  getEvmAccounts,
  Networks,
  subscribeToEvm,
  switchNetworkForEvm,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import { evmBlockchains, isEvmBlockchain, tronBlockchain } from 'rango-types';

import { bitgetInstances } from './helpers';
import signer from './signer';

const WALLET = WalletTypes.BITGET;

export const config = {
  type: WALLET,
  defaultNetwork: Networks.ETHEREUM,
};

export const getInstance = bitgetInstances;

export const connect: Connect = async ({ instance, meta }) => {
  const ethInstance = chooseInstance(instance, meta, Networks.ETHEREUM);
  const tronInstance = chooseInstance(instance, meta, Networks.TRON);

  const results: ProviderConnectResult[] = [];

  if (ethInstance) {
    const evmResult = await getEvmAccounts(ethInstance);
    results.push(evmResult);
  }

  if (tronInstance) {
    const res = await tronInstance.request({ method: 'tron_requestAccounts' });
    if (!res) {
      throw new Error('Please unlock your TronLink extension first.');
    }
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    if (!!res?.code && !!res.message && res.code !== 200) {
      throw new Error(res.message);
    }
    const address = tronInstance.tronWeb.defaultAddress.base58;
    results.push({
      accounts: address ? [address] : [],
      chainId: Networks.TRON,
    });
  }

  return results;
};

export const subscribe: Subscribe = ({
  instance,
  state,
  updateChainId,
  updateAccounts,
  meta,
  connect,
  disconnect,
}) => {
  const ethInstance = instance.get(Networks.ETHEREUM);
  const evmBlockchainMeta = meta.filter(isEvmBlockchain);

  subscribeToEvm({
    instance: ethInstance,
    state,
    updateChainId,
    updateAccounts,
    meta: evmBlockchainMeta,
    connect,
    disconnect,
  });

  window.addEventListener('message', (e) => {
    if (
      e.data.isTronLink &&
      e.data.message &&
      e.data.message.action == 'accountsChanged'
    ) {
      const account = e?.data?.message?.data?.address;
      if (account) {
        updateAccounts([account]);
      } else {
        disconnect();
      }
    }
  });
};

export const switchNetwork: SwitchNetwork = switchNetworkForEvm;

export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;

export const canEagerConnect: CanEagerConnect = async ({ instance, meta }) => {
  const evm_instance = chooseInstance(instance, meta, Networks.ETHEREUM);
  if (evm_instance) {
    return canEagerlyConnectToEvm({ instance: evm_instance, meta });
  }
  return Promise.resolve(false);
};
export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  const tron = tronBlockchain(allBlockChains);
  return {
    name: 'Bitget Wallet',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/bitget/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/bitkeep-crypto-nft-wallet/jiidiaalihmmhddjgbnbgdfflelocpak',
      BRAVE:
        'https://chrome.google.com/webstore/detail/bitkeep-crypto-nft-wallet/jiidiaalihmmhddjgbnbgdfflelocpak',
      DEFAULT: 'https://web3.bitget.com/en/wallet-download?type=1',
    },
    color: '#ffffff',
    supportedChains: [...evms, ...tron],
  };
};
