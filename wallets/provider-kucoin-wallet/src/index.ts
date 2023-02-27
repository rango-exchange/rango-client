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
  Network,
} from '@rango-dev/wallets-shared';
import {
  getKucoinInstance as kucoin_instance,
  KUCOIN_WALLET_SUPPORTED_CHAINS,
} from './helpers';
import signer from './signer';

const WALLET = WalletType.KUCOIN;

export const config = {
  type: WALLET,
};

export const getInstance = kucoin_instance;
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
  return {
    name: 'KuCoin',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/icons/wallets/kucoin.png',
    color: '#b2dbff',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/kucoin-wallet/nbdpmlhambbdkhkmbfpljckjcmgibalo',
      BRAVE:
        'https://chrome.google.com/webstore/detail/kucoin-wallet/nbdpmlhambbdkhkmbfpljckjcmgibalo',
      DEFAULT: 'https://kuwallet.com/',
    },
    supportedChains: allBlockChains.filter((blockchainMeta) =>
      KUCOIN_WALLET_SUPPORTED_CHAINS.includes(blockchainMeta.name as Network)
    ),
  };
};
