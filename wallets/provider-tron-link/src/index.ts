import type {
  CanSwitchNetwork,
  Connect,
  Subscribe,
  WalletInfo,
} from '@yeager-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import { Networks, WalletTypes } from '@yeager-dev/wallets-shared';
import { tronBlockchain } from 'rango-types';

import { tronLink as tronLink_instance } from './helpers';
import signer from './signer';

/*
 * https://docs.tronlink.org/dapp/start-developing
 * https://developers.tron.network/docs/tronlink-events
 */
const WALLET = WalletTypes.TRON_LINK;

export const config = {
  type: WALLET,
  defaultNetwork: Networks.TRON,
};

export const getInstance = tronLink_instance;

export const connect: Connect = async ({ instance }) => {
  let r = undefined;
  const SUCCESS_CODE = 200;
  if (!!instance && !instance.ready) {
    r = await instance.request({ method: 'tron_requestAccounts' });
    if (!r) {
      throw new Error('Please unlock your TronLink extension first.');
    }
    if (r?.code !== SUCCESS_CODE && !!r.message) {
      throw new Error(r.message);
    }
  }
  const address = instance.tronWeb.address.fromHex(
    (await instance.tronWeb.trx.getAccount()).address.toString()
  );
  // TODO check connected network
  return { accounts: address ? [address] : [], chainId: Networks.TRON };
};

export const subscribe: Subscribe = ({ updateAccounts, disconnect }) => {
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

export const canSwitchNetworkTo: CanSwitchNetwork = () => false;

export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const tron = tronBlockchain(allBlockChains);
  return {
    name: 'TronLink',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/tronlink/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec',
      BRAVE:
        'https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec',
      DEFAULT: 'https://www.tronlink.org',
    },
    color: '#96e7ed',
    supportedChains: tron,
  };
};
