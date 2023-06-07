import {
  WalletTypes,
  CanSwitchNetwork,
  Connect,
  Subscribe,
  SwitchNetwork,
  canSwitchNetworkToEvm,
  getEvmAccounts,
  subscribeToEvm,
  switchNetworkForEvm,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import { trustWallet as trustwallet_instance } from './helpers';
import signer from './signer';
import type { SignerFactory, BlockchainMeta } from 'rango-types';
import Rango from 'rango-types';

// For cjs compatibility.
const { evmBlockchains } = Rango;

const WALLET = WalletTypes.TRUST_WALLET;

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

export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  return {
    name: 'Trust Wallet',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/icons/wallets/trust.png',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph/',
      BRAVE:
        'https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph/',
      DEFAULT: 'https://trustwallet.com/browser-extension',
    },
    color: '#ffffff',
    supportedChains: evms,
  };
};
