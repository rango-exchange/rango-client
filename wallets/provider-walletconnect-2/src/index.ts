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
  WalletInfo,
  getBlockChainNameFromId,
  Networks,
  convertEvmBlockchainMetaToEvmChainInfo,
  switchOrAddNetworkForMetamaskCompatibleWallets,
} from '@rango-dev/wallets-shared';
import signer from './signer';
import {
  SignerFactory,
  EvmBlockchainMeta,
  BlockchainMeta,
  evmBlockchains,
} from 'rango-types';

const WALLET = WalletTypes.WALLET_CONNECT_2;

export const config: WalletConfig = {
  type: WALLET,
  checkInstallation: false,
  isAsyncInstance: true,
};

export const getInstance: GetInstance = async (options) => {
  const { network, meta, force, updateChainId } = options;
  // If `network` is provided, trying to get chainId
  const evm_chain_info = convertEvmBlockchainMetaToEvmChainInfo(
    meta as EvmBlockchainMeta[]
  );
  const info = network ? evm_chain_info[network] : undefined;
  const requestedChainId = info?.chainId ? parseInt(info?.chainId) : undefined;

  const nextInstance = await makeConnection({
    chainId: requestedChainId,
    force,
    meta,
  });

  if (force && requestedChainId) {
    // Disconnect any redundant sessions except for the last one
    const sessions = nextInstance.client.session.getAll();
    sessions.forEach(({ topic }: { topic: string }, index: number) => {
      if (index < sessions.length - 1) {
        nextInstance.client.disconnect({
          topic,
        });
      }
    });

    updateChainId?.(requestedChainId);
  }

  return nextInstance;
};

export const connect: Connect = async ({ instance }) => {
  const accounts = await instance.enable();
  const chainId = await instance.request({ method: 'eth_chainId' });

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
    console.log(3333);
    if (error) {
      throw error;
    }

    // Get updated accounts and chainId
    const { accounts, chainId } = payload.params[0];
    updateAccounts(accounts);
    updateChainId(chainId);
  });

  instance.on('session_ping', ({ id, topic }: any) => {
    console.log('session_ping', id, topic);
  });

  instance.on('session_event', (error: any, payload: any) => {
    console.log(4444);

    if (error) {
      throw error;
    }
    // Get updated accounts and chainId
    const { accounts, chainId } = payload.params[0];
    updateAccounts(accounts);
    updateChainId(chainId);
  });

  instance.on('disconnect', async () => {
    disconnect();
  });
};

export const switchNetwork: SwitchNetwork = async ({
  network,
  newInstance,
  instance,
  meta,
}) => {
  const evm_chain_info = convertEvmBlockchainMetaToEvmChainInfo(
    meta as EvmBlockchainMeta[]
  );
  if (supportsForSwitchNetworkRequest(instance)) {
    /*
       `switchOrAddNetworkForMetamaskCompatibleWallets` uses `request` method. Here we are making something it can use.
     */

    await switchOrAddNetworkForMetamaskCompatibleWallets(
      instance,
      network,
      evm_chain_info
    );
  } else if (newInstance) {
    await newInstance({ force: true, network });
  }
};

export const canSwitchNetworkTo: CanSwitchNetwork = () => false;
export const disconnect: Disconnect = async ({ instance, destroyInstance }) => {
  if (instance) {
    try {
      // Disconnect the instance and remove any pairing sessions
      await instance.disconnect();
      const pairingSessions = instance.client.pairing.getAll();
      pairingSessions.forEach(({ topic }: { topic: string }) => {
        try {
          instance.client.disconnect({
            topic,
          });
        } catch {
          // do nothing
        }
      });
    } catch {
      // do nothing
    }
    destroyInstance();
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
