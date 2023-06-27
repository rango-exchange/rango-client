import {
  WalletTypes,
  CanSwitchNetwork,
  Connect,
  Subscribe,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import { myTonWallet as myTonWallet_instance } from './helpers';
import signer from './signer';
import { SignerFactory, BlockchainMeta, tonBlockchain } from 'rango-types';
import TonConnect, { toUserFriendlyAddress } from '@tonconnect/sdk';

const WALLET = WalletTypes.MY_TON_WALLET;

export const config = {
  type: WALLET,
};

const walletConnectionSource = {
  jsBridgeKey: 'mytonwallet',
};

export const connector = new TonConnect({
  // This is a test manifest and should be replaced with a real manifest after testing.
  manifestUrl:
    'https://gist.githubusercontent.com/siandreev/75f1a2ccf2f3b4e2771f6089aeb06d7f/raw/d4986344010ec7a2d1cc8a2a9baa57de37aaccb8/gistfile1.txt',
});

export const getInstance = myTonWallet_instance;
export const connect: Connect = async () => {
  await connector.restoreConnection();

  if (!connector.account) connector.connect(walletConnectionSource);
  return [];
};

export const subscribe: Subscribe = ({ updateAccounts }) => {
  connector.onStatusChange((walletInfo) => {
    if (walletInfo?.account)
      updateAccounts([toUserFriendlyAddress(walletInfo?.account.address)]);
  });
};

export const canSwitchNetworkTo: CanSwitchNetwork = () => false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const ton = tonBlockchain(allBlockChains);
  return {
    name: 'MyTonWallet',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/291374d3f0587e92cf5e43586e2761084b8ccc66/assets/icons/wallets/mytonwallet.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/mytonwallet-%C2%B7-my-ton-wall/fldfpgipfncgndfolcbkdeeknbbbnhcc',

      DEFAULT: 'https://mytonwallet.io/',
    },
    color: '#fff',
    supportedChains: ton,
  };
};
