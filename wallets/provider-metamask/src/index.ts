import {
  WalletType,
  CanSwitchNetwork,
  Connect,
  Subscribe,
  SwitchNetwork,
  WalletSigners,
  canSwitchNetworkToEvm,
  getEvmAccounts,
  subscribeToEvm,
  switchNetworkForEvm,
  evmBlockchains,
  BlockchainMeta,
  WalletInfo,
} from '@rangodev/wallets-shared';
import { metamask as metamask_instance } from './helpers';
import signer from './signer';

const WALLET = WalletType.META_MASK;

export const config = {
  type: WALLET,
};

export const getInstance = metamask_instance;
export const connect: Connect = async ({ instance }) => {
  // Note: We need to get `chainId` here, because for the first time
  // after opening the browser, wallet is locked, and don't give us accounts and chainId
  // on `check` phase, so `network` will be null. For this case we need to get chainId
  // whenever we are requesting accounts.
  const { accounts, chainId } = await getEvmAccounts(instance);

  return {
    accounts,
    chainId,
  };
};

export const subscribe: Subscribe = subscribeToEvm;

export const switchNetwork: SwitchNetwork = switchNetworkForEvm;

export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;

export const getSigners: (provider: any) => WalletSigners = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  return {
    name: 'MetaMask',
    img: 'https://lh3.googleusercontent.com/QW0gZ3yugzXDvTANa5-cc1EpabQ2MGnl6enW11O6kIerEaBQGOhgyUOvhRedndD9io8RJMmJZfIXq1rMxUsFHS2Ttw=w128-h128-e365-rj-sc0x00ffffff',
    installLink:
      'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en',
    color: '#dac7ae',
    supportedChains: evms,
  };
};
