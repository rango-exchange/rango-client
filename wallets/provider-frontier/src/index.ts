import {
  Network,
  WalletType,
  CanSwitchNetwork,
  Connect,
  Subscribe,
  WalletSigners,
  BlockchainMeta,
  WalletInfo,
  getEvmAccounts,
  evmBlockchains,
  SwitchNetwork,
  switchNetworkForEvm,
  canSwitchNetworkToEvm,
  subscribeToEvm,
} from '@rangodev/wallets-shared';
import { frontier as frontier_instance } from './helpers';
import signer from './signer';

const WALLET = WalletType.FRONTIER;

export const config = {
  type: WALLET,
  defaultNetwork: Network.ETHEREUM,
};

export const getInstance = frontier_instance;
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
    name: 'Frontier',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/icons/wallets/frontier.png',
    installLink:
      'https://chrome.google.com/webstore/detail/frontier-wallet/kppfdiipphfccemcignhifpjkapfbihd',
    color: '#4d40c6',
    supportedChains: [...evms],
  };
};
