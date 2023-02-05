import {
  Network,
  WalletType,
  Connect,
  Subscribe,
  WalletSigners,
  getCosmosAccounts,
  BlockchainMeta,
  WalletInfo,
  cosmosBlockchains,
} from '@rangodev/wallets-shared';
import { leap_instance } from './helpers';
import signer from './signer';

const WALLET = WalletType.LEAP;

export const config = {
  type: WALLET,
  defaultNetwork: Network.COSMOS,
};

export const getInstance = leap_instance;
export const connect: Connect = async ({ instance, network, meta }) => {
  const results = await getCosmosAccounts({
    instance,
    meta,
    network,
  });
  return results;
};

export const subscribe: Subscribe = ({ connect, disconnect }) => {
  window.addEventListener('leap_keystorechange', () => {
    disconnect();
    connect();
  });
};

export const getSigners: (provider: any) => WalletSigners = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const cosmos = cosmosBlockchains(allBlockChains);
  return {
    name: 'Leap',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/icons/wallets/leap.png',
    installLink:
      'https://chrome.google.com/webstore/detail/leap-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg',
    color: 'black',
    supportedChains: cosmos.filter((blockchainMeta) => !!blockchainMeta.info),
  };
};
