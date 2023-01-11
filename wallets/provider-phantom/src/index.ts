import {
  Network,
  WalletType,
  CanSwitchNetwork,
  Connect,
  Subscribe,
  WalletSigners,
  getSolanaAccounts,
  BlockchainMeta,
  WalletInfo,
  solanaBlockchain,
} from '@rangodev/wallets-shared';
import { phantom as phantom_instance } from './helpers';
import signer from './signer';

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

export const getSigners: (provider: any) => WalletSigners = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const solana = solanaBlockchain(allBlockChains);
  return {
    name: 'Phantom',
    img: 'https://avatars.githubusercontent.com/u/78782331?s=200&v=4',
    installLink:
      'https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa',
    color: '#4d40c6',
    supportedChains: solana,
  };
};
