import { makeConnection, supportsForSwitchNetworkRequest } from './helpers';
import {
  WalletTypes,
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
  Networks,
  convertEvmBlockchainMetaToEvmChainInfo,
} from '@rango-dev/wallets-shared';
import signer from './signer';
import {
  SignerFactory,
  EvmBlockchainMeta,
  BlockchainMeta,
  evmBlockchains,
} from 'rango-types';
import { SessionTypes } from '@walletconnect/types';

const WALLET = WalletTypes.WALLET_CONNECT_2;

export const config: WalletConfig = {
  type: WALLET,
  checkInstallation: false,
  isAsyncInstance: true,
};

export const getInstance: GetInstance = async (options) => {
  const { network, currentProvider, meta, force, updateChainId } = options;
  // If `network` is provided, trying to get chainId
  const evm_chain_info = convertEvmBlockchainMetaToEvmChainInfo(
    meta as EvmBlockchainMeta[]
  );
  const info = network ? evm_chain_info[network] : undefined;
  const requestedChainId = info?.chainId ? parseInt(info?.chainId) : undefined;

  const nextInstance = await makeConnection({
    chainId: requestedChainId,
    force,
  });
  console.log(currentProvider);
  const getAllSessions = nextInstance.signer.client.session.getAll();
  getAllSessions.forEach((session: SessionTypes.Struct, index: number) => {
    if (index < getAllSessions.length - 1) {
      nextInstance.signer.client.disconnect({
        topic: session?.topic,
      });
    }
  });

  if (force && requestedChainId) updateChainId?.(requestedChainId);

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
  meta,
  connect,
  disconnect,
}) => {
  instance?.on('chainChanged', (chainId: string) => {
    console.log('111111111');
    const network = getBlockChainNameFromId(chainId, meta) || Networks.Unknown;

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

  instance.on('disconnect', async ({ data: topic }: any) => {
    try {
      await instance?.signer.client.disconnect({
        topic,
      });
    } finally {
      disconnect();
    }
  });
};

export const switchNetwork: SwitchNetwork = async ({
  network,
  newInstance,
}) => {
  if (newInstance) {
    await newInstance({ force: true, network });
  }
};

export const canSwitchNetworkTo: CanSwitchNetwork = ({
  network,
  meta,
  provider,
}) => {
  if (supportsForSwitchNetworkRequest(provider)) {
    return canSwitchNetworkToEvm({ network, meta, provider });
  }
  return false;
};
export const disconnect: Disconnect = async ({ instance, destroyInstance }) => {
  if (instance) {
    try {
      await instance.disconnect();
      if (!instance.session) {
        destroyInstance();
      }
    } catch {
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
    name: 'WalletConnect',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/icons/wallets/walletconnect.svg',
    installLink: '',
    color: '#b2dbff',
    supportedChains: evms,
    showOnMobile: true,
    mobileWallet: true,
  };
};
