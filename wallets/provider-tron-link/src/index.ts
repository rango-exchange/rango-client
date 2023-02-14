import { Subscribe } from '@rangodev/wallets-shared';
import {
  Network,
  WalletType,
  CanSwitchNetwork,
  Connect,
  WalletSigners,
  BlockchainMeta,
  WalletInfo,
  tronBlockchain,
} from '@rangodev/wallets-shared';
import { tronLink as tronLink_instance } from './helpers';
import signer from './signer';

// https://docs.tronlink.org/dapp/start-developing
// https://developers.tron.network/docs/tronlink-events
const WALLET = WalletType.TRON_LINK;

export const config = {
  type: WALLET,
  defaultNetwork: Network.TRON,
};

export const getInstance = tronLink_instance;

export const connect: Connect = async ({ instance }) => {
  let r = undefined;
  if (!!instance && !instance.ready) {
    r = await instance.request({ method: 'tron_requestAccounts' });
    if (!r) {
      throw new Error('Please unlock your TronLink extension first.');
    }
    if (r.code === 200) {
    } else if (!!r?.code && !!r.message) {
      throw new Error(r.message);
    }
  }
  const address = instance.tronWeb.address.fromHex(
    (await instance.tronWeb.trx.getAccount()).address.toString()
  );
  // TODO check connected network
  return { accounts: !!address ? [address] : [], chainId: Network.TRON };
};

export const subscribe: Subscribe = ({ updateAccounts, disconnect }) => {
  window.addEventListener('message', (e) => {
    if (
      e.data.isTronLink &&
      e.data.message &&
      e.data.message.action == 'accountsChanged'
    ) {
      const account = e?.data?.message?.data?.address;
      if (!!account) {
        updateAccounts([account]);
      } else {
        disconnect();
      }
    }
  });
};

export const canSwitchNetworkTo: CanSwitchNetwork = () => false;

export const getSigners: (provider: any) => WalletSigners = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const tron = tronBlockchain(allBlockChains);
  return {
    name: 'TronLink',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/icons/wallets/tronlink.png',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec',
      FIREFOX: 'https://addons.mozilla.org/en-US/firefox/addon/tronlink-wallet',
    },
    color: '#96e7ed',
    supportedChains: tron,
  };
};
