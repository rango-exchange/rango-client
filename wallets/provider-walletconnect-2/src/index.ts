import { makeConnection } from './helpers';
import {
  WalletType,
  CanSwitchNetwork,
  Connect,
  Disconnect,
  GetInstance,
  Subscribe,
  SwitchNetwork,
  WalletConfig,
  canSwitchNetworkToEvm,
  WalletInfo,
  getBlockChainNameFromId,
  Network,
  convertEvmBlockchainMetaToEvmChainInfo,
} from '@rango-dev/wallets-shared';
import signer from './signer';
import {
  SignerFactory,
  EvmBlockchainMeta,
  BlockchainMeta,
  evmBlockchains,
} from 'rango-types';

const WALLET = WalletType.WALLET_CONNECT_2;

export const config: WalletConfig = {
  type: WALLET,
  checkInstallation: false,
  isAsyncInstance: true,
};

export const getInstance: GetInstance = async ({
  network,
  currentProvider,
  meta,
  force,
}) => {
  // If `network` is provided, trying to get chainId
  const evm_chain_info = convertEvmBlockchainMetaToEvmChainInfo(
    meta as EvmBlockchainMeta[]
  );
  const info = network ? evm_chain_info[network] : undefined;
  const requestedChainId = info?.chainId ? parseInt(info?.chainId) : undefined;

  const nextInstance = await makeConnection({
    provider: currentProvider,
    chainId: requestedChainId,
    force,
  });
  return nextInstance;
};

export const connect: Connect = async ({ instance }) => {
  const accounts = instance.accounts;
  const chainId = instance.chainId;

  return {
    accounts,
    chainId,
  };
};

export const subscribe: Subscribe = ({
  instance,
  updateChainId,
  updateAccounts,
  disconnect,
  meta,
  connect,
}) => {
  instance?.on('chainChanged', (chainId: string) => {
    const network = getBlockChainNameFromId(chainId, meta) || Network.Unknown;

    updateChainId(chainId);
    connect(network);
  });
  // Subscribe to connection events
  instance.on('connect', (error: any, payload: any) => {
    if (error) {
      throw error;
    }

    const { accounts, chainId } = payload.params[0];

    updateAccounts(accounts);
    updateChainId(chainId);
  });

  instance.on('session_update', (error: any, payload: any) => {
    if (error) {
      throw error;
    }

    // Get updated accounts and chainId
    const { accounts, chainId } = payload.params[0];
    updateAccounts(accounts);
    updateChainId(chainId);
  });

  instance.on('session_event', (error: any, payload: any) => {
    if (error) {
      throw error;
    }
    // Get updated accounts and chainId
    const { accounts, chainId } = payload.params[0];
    updateAccounts(accounts);
    updateChainId(chainId);
  });

  instance.on('disconnect', () => {
    disconnect();
  });
};

export const switchNetwork: SwitchNetwork = async ({
  network,
  newInstance,
}) => {
  if (!!newInstance) {
    await newInstance({ force: true, network });
  }
};

export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;

export const disconnect: Disconnect = async ({ instance, destroyInstance }) => {
  if (instance) {
    await instance.disconnect();
    if (!instance.session) {
      destroyInstance();
    }
  }
};

export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  return {
    name: 'WalletConnect2',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/icons/wallets/walletconnect.svg',
    installLink: '',
    color: '#b2dbff',
    supportedChains: evms,
    showOnMobile: true,
  };
};
