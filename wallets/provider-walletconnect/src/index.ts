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
  convertEvmBlockchainMetaToEvmChainInfo,
  switchOrAddNetworkForMetamaskCompatibleWallets,
  WalletInfo,
  canSwitchNetworkToEvm,
} from '@rango-dev/wallets-shared';
import { formatJsonRpcRequest } from '@walletconnect/jsonrpc-utils';
import signer from './signer';
import type {
  SignerFactory,
  EvmBlockchainMeta,
  BlockchainMeta,
} from 'rango-types';

import Rango from 'rango-types';

const { evmBlockchains } = Rango;

const WALLET = WalletTypes.WALLET_CONNECT;

export const config: WalletConfig = {
  type: WALLET,
  checkInstallation: false,
  isAsyncInstance: true,
};

export const getInstance: GetInstance = async (options) => {
  const { network, currentProvider, meta, updateChainId } = options;
  // If `network` is provided, trying to get chainId
  const evm_chain_info = convertEvmBlockchainMetaToEvmChainInfo(
    meta as EvmBlockchainMeta[]
  );
  const info = network ? evm_chain_info[network] : undefined;
  const requestedChainId = info?.chainId ? parseInt(info?.chainId) : undefined;

  const nextInstance = await makeConnection({
    provider: currentProvider,
    chainId: requestedChainId,
  });

  if (options.force && requestedChainId) updateChainId?.(requestedChainId);

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

export const subscribe: Subscribe = async ({
  instance,
  updateChainId,
  updateAccounts,
  disconnect,
}) => {
  // Subscribe to connection events
  instance.on('connect', (error: any, payload: any) => {
    if (error) {
      throw error;
    }

    // Get provided accounts and chainId
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

  instance.on('disconnect', (error: any, _payload: any) => {
    if (error) {
      throw error;
    }

    disconnect();
  });
};

export const switchNetwork: SwitchNetwork = async ({
  instance,
  meta,
  network,
  newInstance,
}) => {
  const evm_chain_info = convertEvmBlockchainMetaToEvmChainInfo(
    meta as EvmBlockchainMeta[]
  );

  /* 
     There are two methods for switch network
     1. Wallet supports `wallet_switchEthereumChain` rpc method. like Metamask
     2. Kill the current session and making a new session with new chain.
   */
  if (supportsForSwitchNetworkRequest(instance)) {
    /* 
       `switchOrAddNetworkForMetamaskCompatibleWallets` needs a web3-provider interface.
      And uses `request` method. Here we are making something it can use.
     */

    const simulatedWeb3Instance = {
      request: (payload: any): Promise<any> => {
        const rpcRequest = formatJsonRpcRequest(payload.method, payload.params);
        return instance.sendCustomRequest(rpcRequest);
      },
    };

    await switchOrAddNetworkForMetamaskCompatibleWallets(
      simulatedWeb3Instance,
      network,
      evm_chain_info
    );
  } else {
    // Kill the old session, make a new session with requested network.

    // Remove `discconect` listener, because it will reset the state
    // But we decided to show user is connect to wallet and
    // Only kill the session and instance.
    instance.off('disconnect');

    await instance.killSession();

    if (newInstance) {
      await newInstance({ force: true, network });
    }
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
  if (instance && instance.peerMeta) {
    await instance.killSession().catch(() => {
      /* Ignore error. */
    });

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
