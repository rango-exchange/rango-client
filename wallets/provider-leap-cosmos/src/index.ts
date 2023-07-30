import {
  Networks,
  WalletTypes,
  Connect,
  Subscribe,
  getCosmosAccounts,
  WalletInfo,
  CanEagerConnect,
} from '@rango-dev/wallets-shared';
import { leap_cosmos_instance, getSupportedChains } from './helpers';
import signer from './signer';
import { SignerFactory, cosmosBlockchains, BlockchainMeta } from 'rango-types';

const WALLET = WalletTypes.LEAP_COSMOS;

export const config = {
  type: WALLET,
  defaultNetwork: Networks.COSMOS,
};

export const getInstance = leap_cosmos_instance;
export const connect: Connect = async ({ instance, network, meta }) => {
  const supportedChains = await getSupportedChains(instance);
  const leapBlockchainMeta = meta.filter(
    (chain) =>
      chain.enabled &&
      (supportedChains.includes(chain.name.toLowerCase()) ||
        chain.name === network)
  );
  const results = await getCosmosAccounts({
    instance,
    meta: leapBlockchainMeta,
  });
  return results;
};

export const subscribe: Subscribe = ({ connect, disconnect }) => {
  window.addEventListener('leap_keystorechange', () => {
    disconnect();
    connect();
  });
};

export const getSigners: (provider: any) => SignerFactory = signer;

export const canEagerConnect: CanEagerConnect = () => Promise.resolve(true);

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const cosmos = cosmosBlockchains(allBlockChains);
  return {
    name: 'Leap Cosmos',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/icons/wallets/leap-cosmos.png',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/leap-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg',
      BRAVE:
        'https://chrome.google.com/webstore/detail/leap-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg',
      DEFAULT: 'https://www.leapwallet.io/cosmos',
    },
    color: 'black',
    supportedChains: cosmos.filter((blockchainMeta) => !!blockchainMeta.info),
  };
};
