import {
  WalletTypes,
  CanSwitchNetwork,
  Connect,
  Subscribe,
  WalletInfo,
  getEvmAccounts,
  subscribeToEvm,
  switchNetworkForEvm,
  SwitchNetwork,
  canSwitchNetworkToEvm,
  Network,
} from '@rango-dev/wallets-shared';
import { SignerFactory, BlockchainMeta } from 'rango-types';
import {
  TAHO_WALLET_SUPPORTED_CHAINS,
  taho as taho_instances,
} from './helpers';
import signer from './signer';

const WALLET = WalletTypes.TAHO;

export const config = {
  type: WALLET,
};

export const getInstance = taho_instances;

export const connect: Connect = async ({ instance }) => {
  const { accounts, chainId } = await getEvmAccounts(instance);

  return {
    accounts,
    chainId,
  };
};
export const subscribe: Subscribe = subscribeToEvm;

export const switchNetwork: SwitchNetwork = switchNetworkForEvm;

export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;

export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  return {
    name: 'Taho',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/icons/wallets/taho.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/taho/eajafomhmkipbjmfmhebemolkcicgfmd',
      BRAVE:
        'https://chrome.google.com/webstore/detail/taho/eajafomhmkipbjmfmhebemolkcicgfmd',
      DEFAULT: 'https://taho.xyz',
    },
    color: '#ffffff',
    supportedChains: allBlockChains.filter((blockchainMeta) =>
      TAHO_WALLET_SUPPORTED_CHAINS.includes(blockchainMeta.name as Network)
    ),
  };
};
