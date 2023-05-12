import {
  CanSwitchNetwork,
  Connect,
  Network,
  Subscribe,
  SwitchNetwork,
  WalletInfo,
  WalletType,
  canSwitchNetworkToEvm,
  getEvmAccounts,
  subscribeToEvm,
  switchNetworkForEvm,
} from '@rango-dev/wallets-shared';
import { enkrypt as enkrypt_instance } from './helpers';
import { BlockchainMeta, SignerFactory, evmBlockchains } from 'rango-types';
import signer from './signer';

export const getInstance = enkrypt_instance;

const WALLET = WalletType.ENKRYPT;

export const config = {
  type: WALLET,
  defaultNetwork: Network.ETHEREUM,
};

export const connect: Connect = async ({ instance }) => {
  let { accounts, chainId } = await getEvmAccounts(instance);
  if (accounts.length > 1) accounts = [instance.selectedAddress];

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
    name: 'Enkrypt',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/icons/wallets/enkrypt.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/enkrypt/kkpllkodjeloidieedojogacfhpaihoh',
      FIREFOX: 'https://addons.mozilla.org/en-US/firefox/addon/enkrypt/',
      BRAVE:
        'https://chrome.google.com/webstore/detail/enkrypt/kkpllkodjeloidieedojogacfhpaihoh',
      EDGE: 'https://microsoftedge.microsoft.com/addons/detail/enkrypt-ethereum-polkad/gfenajajnjjmmdojhdjmnngomkhlnfjl',

      DEFAULT: 'https://www.enkrypt.com/',
    },
    color: '#fff',
    supportedChains: evms,
  };
};
