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
  BlockchainMeta,
  WalletInfo,
  evmBlockchains,
} from '@rangodev/wallets-shared';
import { tokenpocket as tokenpocket_instance } from './helpers';
import signer from './signer';

const WALLET = WalletType.TOKEN_POCKET;

export const config = {
  type: WALLET,
};

export const getInstance = tokenpocket_instance;
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
    name: 'Token Pocket',
    img: 'https://app.rango.exchange/wallets/tp.png',
    color: '#b2dbff',
    installLink:
      'https://chrome.google.com/webstore/detail/tokenpocket/mfgccjchihfkkindfppnaooecgfneiii',
    supportedChains: evms,
  };
};
