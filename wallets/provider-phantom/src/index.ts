import {
  Network,
  WalletType,
  CanSwitchNetwork,
  Connect,
  Subscribe,
  getSolanaAccounts,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import { phantom as phantom_instance } from './helpers';
import signer from './signer';
import { SignerFactory, BlockchainMeta, solanaBlockchain } from 'rango-types';

const WALLET = WalletType.PHANTOM;

export const config = {
  type: WALLET,
};

export const getInstance = phantom_instance;
export const connect: Connect = getSolanaAccounts;

export const subscribe: Subscribe = ({ instance, updateAccounts, connect }) => {
  instance?.on('accountChanged', async (publicKey: string) => {
    const network = Network.SOLANA;
    if (publicKey) {
      const account = publicKey.toString();
      updateAccounts([account]);
    } else {
      connect(network);
    }
  });
};

export const canSwitchNetworkTo: CanSwitchNetwork = () => false;

export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const solana = solanaBlockchain(allBlockChains);
  return {
    name: 'Phantom',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/icons/wallets/phantom.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa',

      DEFAULT: 'https://phantom.app/',
    },
    color: '#4d40c6',
    supportedChains: solana,
  };
};
