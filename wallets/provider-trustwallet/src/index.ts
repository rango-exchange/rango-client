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
import { trustWallet as trustwallet_instance } from './helpers';
import signer from './signer';

const WALLET = WalletType.TRUST_WALLET;

export const config = {
  type: WALLET,
};

export const getInstance = trustwallet_instance;

// doc: https://developer.trustwallet.com/trust-wallet-browser-extension/extension-guide
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

export const getSigners: (provider: any) => WalletSigners = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  return {
    name: 'Trust Wallet',
    img: 'https://app.rango.exchange/wallets/trust.png',
    installLink:
      'https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph/',
    color: '#ffffff',
    supportedChains: evms,
  };
};
