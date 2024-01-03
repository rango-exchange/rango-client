import type {
  CanSwitchNetwork,
  Connect,
  Subscribe,
  WalletInfo,
} from '@yeager-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import { WalletTypes } from '@yeager-dev/wallets-shared';
import { ConnectType } from '@terra-money/wallet-controller';

import { station as station_instance } from './helpers';
import signer from './signer';

const WALLET = WalletTypes.STATION;
const STATION_WALLET_ID = 'station';
const INTERVAL_TIMEOUT = 3_000;
const MAX_TRY_COUNT = 3;

export const config = {
  type: WALLET,
};

async function waitInterval(instance: any) {
  return new Promise<any>((resolve) => {
    let count = 1;
    const interval = setInterval(async () => {
      const state = instance.extension.getLastStates();
      if (state.type === 'WALLET_CONNECTED') {
        resolve(state);
        clearInterval(interval);
      } else {
        count++;
      }
      if (count > MAX_TRY_COUNT) {
        resolve(state);
        clearInterval(interval);
      }
    }, INTERVAL_TIMEOUT);
  });
}

export const getInstance = station_instance;
export const connect: Connect = async ({ instance, meta }) => {
  let accounts: string[] = [];
  let chainId = '';
  await instance.connect(ConnectType.EXTENSION, STATION_WALLET_ID);
  await instance.refetchStates();
  const { network, wallet, type } = await waitInterval(instance);
  if (type === 'INITIALIZING') {
    throw new Error('Please unlock your Station wallet first.');
  }
  chainId = network.chainID;
  const foundChain = meta.find((m) => m.chainId === chainId);
  if (!foundChain) {
    throw new Error(
      "We don't support this chain. Please try with another chain"
    );
  }
  accounts = [wallet.terraAddress];
  return { accounts, chainId };
};

export const subscribe: Subscribe = ({
  instance,
  updateAccounts,
  updateChainId,
}) => {
  instance.states().subscribe({
    next: (value: any) => {
      if (value.status === 'WALLET_CONNECTED') {
        const accounts = value.wallets.map(
          ({ terraAddress }: any) => terraAddress
        );
        updateAccounts(accounts);
        updateChainId(value.network.chainID);
      }
    },
  });
};

export const canSwitchNetworkTo: CanSwitchNetwork = () => false;

export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  return {
    name: 'Station',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/station/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/terra-station/aiifbnbfobpmeekipheeijimdpnlpgpp',
      BRAVE:
        'https://chrome.google.com/webstore/detail/station-wallet/aiifbnbfobpmeekipheeijimdpnlpgpp',
      FIREFOX:
        'https://addons.mozilla.org/en-US/firefox/addon/terra-station-wallet/?utm_source=addons.mozilla.org',
      DEFAULT:
        'https://classic-docs.terra.money/docs/learn/terra-station/download/terra-station-desktop.html',
    },
    color: '#ffffff',
    supportedChains: allBlockChains.filter((blockchainMeta) =>
      ['TERRA_CLASSIC', 'TERRA'].includes(blockchainMeta.name)
    ),
  };
};
