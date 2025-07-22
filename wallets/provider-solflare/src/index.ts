import type {
  CanSwitchNetwork,
  Connect,
  Subscribe,
  WalletInfo,
} from '@arlert-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import { Networks, WalletTypes } from '@arlert-dev/wallets-shared';
import Solflare from '@solflare-wallet/sdk';
import { solanaBlockchain } from 'rango-types';

import signer from './signer.js';

const WALLET = WalletTypes.SOLFLARE;

export const config = {
  type: WALLET,
};
/*
 * Solflare is a transpiling ESM to CJS as well. It causes interop issues which is normally will be fixed using following code
 */
let SDK = Solflare;
if (
  typeof Solflare !== 'function' &&
  // @ts-expect-error This import error is not visible to TypeScript
  typeof Solflare.default === 'function'
) {
  SDK = (Solflare as unknown as { default: typeof Solflare }).default;
}
const walletInstance = new SDK();

export const getInstance = () => (window.solflare ? walletInstance : null);
export const connect: Connect = async ({
  instance,
}: {
  instance: Solflare;
}) => {
  try {
    await instance.connect();

    if (instance.publicKey) {
      const account = instance.publicKey?.toString();

      return {
        accounts: [account],
        chainId: Networks.SOLANA,
      };
    }
    throw new Error();
  } catch (error) {
    throw new Error('An error occurred while connecting to Solflare.');
  }
};

export const subscribe: Subscribe = ({
  instance,
  updateAccounts,
  disconnect,
}) => {
  const handleAccountsChanged = async (publicKey: string) => {
    if (publicKey) {
      const account = publicKey.toString();
      updateAccounts([account]);
    } else {
      disconnect();
    }
  };
  instance?.on?.('accountChanged', handleAccountsChanged);

  return () => {
    instance?.off?.('accountChanged', handleAccountsChanged);
  };
};

export const canSwitchNetworkTo: CanSwitchNetwork = () => false;

export const getSigners: (provider: any) => Promise<SignerFactory> = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const solana = solanaBlockchain(allBlockChains);
  return {
    name: 'Solflare',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/solflare/icon.svg',
    installLink: {
      CHROME:
        'https://chromewebstore.google.com/detail/solflare-wallet/bhhhlbepdkbapadjdnnojkbgioiodbic',
      BRAVE:
        'https://chromewebstore.google.com/detail/solflare-wallet/bhhhlbepdkbapadjdnnojkbgioiodbic',
      FIREFOX:
        'https://addons.mozilla.org/en-US/firefox/addon/solflare-wallet/',
      EDGE: 'https://chromewebstore.google.com/detail/solflare-wallet/bhhhlbepdkbapadjdnnojkbgioiodbic',
      DEFAULT: 'https://solflare.com',
    },
    color: '#4d40c6',
    supportedChains: solana,
  };
};
