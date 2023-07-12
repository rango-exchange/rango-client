import {
  WalletTypes,
  CanSwitchNetwork,
  Connect,
  WalletInfo,
  Networks,
} from '@rango-dev/wallets-shared';
import { myTonWallet as myTonWallet_instance } from './helpers';
import signer from './signer';
import { SignerFactory, BlockchainMeta, tonBlockchain } from 'rango-types';
import { toUserFriendlyAddress } from '@tonconnect/sdk';

type TonConnectResult = {
  event: string;
  id: number;
  payload?: {
    items: {
      address: string;
      name: string;
      network: string;
      publicKey: string;
      walletStateInit: string;
    }[];
  };
};

const WALLET = WalletTypes.MY_TON_WALLET;

export const config = {
  type: WALLET,
};

export const getInstance = myTonWallet_instance;
export const connect: Connect = async ({ instance }) => {
  const result: TonConnectResult = await instance.restoreConnection();
  const accounts = result.payload?.items?.map(({ address }) =>
    toUserFriendlyAddress(address)
  );
  if (accounts) {
    return { accounts, chainId: Networks.TON };
  } else {
    const result: TonConnectResult = await instance.connect(2, {
      manifestUrl:
        'https://ton-connect.github.io/demo-dapp//tonconnect-manifest.json',
      items: [{ name: 'ton_addr' }],
    });
    const accounts = result.payload?.items.map(({ address }) =>
      toUserFriendlyAddress(address)
    );
    return { accounts: accounts ?? [], chainId: Networks.TON };
  }
};

// export const subscribe: Subscribe = ({ updateAccounts, instance }) => {
//   instance.listen((walletInfo: any) => {
//     console.log(walletInfo);
//     if (walletInfo?.account)
//       updateAccounts([toUserFriendlyAddress(walletInfo?.account.address)]);
//   });
// };

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
