import type { Environments, WCInstance } from './types.js';
import type {
  CanSwitchNetwork,
  Connect,
  Disconnect,
  GetInstance,
  Subscribe,
  SwitchNetwork,
  WalletConfig,
  WalletInfo,
} from '@arlert-dev/wallets-shared';
import type { ISignClient } from '@walletconnect/types';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import { debug, error as logError } from '@arlert-dev/logging-core';
import { Networks, WalletTypes } from '@arlert-dev/wallets-shared';
import Client from '@walletconnect/sign-client';
import { AccountId, ChainId } from 'caip';
import { evmBlockchains } from 'rango-types';

import {
  DEFAULT_APP_METADATA,
  DEFAULT_NETWORK,
  EthereumEvents,
  EthereumRPCMethods,
  NAMESPACES,
  RELAY_URL,
} from './constants.js';
import {
  createModalInstance,
  filterEvmAccounts,
  simulateRequest,
  switchOrAddEvmChain,
} from './helpers.js';
import {
  cleanupSingleSession,
  disconnectSessions,
  getAccountsFromEvent,
  getAccountsFromSession,
  getPersistedChainId,
  ignoreNamespaceMethods,
  persistCurrentChainId,
  tryConnect,
  updateSessionAccounts,
} from './session.js';
import signer from './signer.js';

const WALLET = WalletTypes.WALLET_CONNECT_2;

let envs: Environments = {
  WC_PROJECT_ID: '',
  DISABLE_MODAL_AND_OPEN_LINK: undefined,
};

export type { Environments };

export const init = (environments: Environments) => {
  envs = environments;

  createModalInstance(envs.WC_PROJECT_ID);
};

export const config: WalletConfig = {
  type: WALLET,
  checkInstallation: false,
  isAsyncInstance: true,
  defaultNetwork: DEFAULT_NETWORK,
  isAsyncSwitchNetwork: true,
};

export const getInstance: GetInstance = async (options) => {
  const { currentProvider, getState, meta } = options;

  /*
   * Create a new pair, if exists use the pair,
   * Or use the already created one.
   */
  let provider: ISignClient;
  if (!currentProvider) {
    if (!envs.WC_PROJECT_ID) {
      throw new Error(
        'You need to set `WC_PROJECT_ID` in Wallet Connect provider.'
      );
    }
    provider = await Client.init({
      relayUrl: RELAY_URL,
      projectId: envs.WC_PROJECT_ID,
      metadata: DEFAULT_APP_METADATA,
    });
  } else {
    provider = currentProvider;
  }

  return {
    client: provider,
    session: null,
    request: async (params: any) =>
      simulateRequest(params, provider, meta, getState),
  };
};

export const connect: Connect = async ({ instance, meta }) => {
  const { client } = instance as WCInstance;
  // Try to restore the session first, if couldn't, create a new session by showing a modal.
  const session = await tryConnect(client, { meta, envs });
  // Override the value (session).
  instance.session = session;
  const currentChainId = await getPersistedChainId(client);
  const accounts = getAccountsFromSession(session);
  return filterEvmAccounts(accounts, currentChainId);
};

export const subscribe: Subscribe = ({
  instance,
  updateChainId,
  updateAccounts,
  disconnect,
}) => {
  const { client } = instance as WCInstance;

  /**
   * Session events refrence:
   * https://docs.walletconnect.com/2.0/specs/clients/sign/session-events
   */

  // Listen to updating the session by adding a new chain, method, or event
  client.on('session_update', (args) => {
    const allAccounts = getAccountsFromEvent(args);
    allAccounts.forEach((accountsWithChain) => {
      updateAccounts(accountsWithChain.accounts, accountsWithChain.chainId);
    });
  });

  // Listen to events triggred by wallet. (e.g. accountsChanged and chainChanged)
  client.on('session_event', (args) => {
    if (args.params.event.name === EthereumEvents.ACCOUNTS_CHANGED) {
      const accounts = args.params.event.data.map((account: string) => {
        return new AccountId(account).address;
      });
      const chainId = ChainId.parse(args.params.chainId).reference;
      updateAccounts(accounts);
      updateChainId(chainId);
    } else if (args.params.event.name === EthereumEvents.CHAIN_CHANGED) {
      const chainId = args.params.event.data;
      updateChainId(chainId);
      void persistCurrentChainId(instance.client, chainId);
    } else {
      console.log('[WC2] session_event not supported', args.params.event);
    }
  });

  client.on('session_delete', async (event) => {
    console.log('[WC2] your wallet has requested to delete session.', event);
    void cleanupSingleSession(client, event.topic);
    disconnect();
  });
};

export const switchNetwork: SwitchNetwork = async ({
  network,
  instance,
  meta,
  getState,
  updateChainId,
}) => {
  const evm = evmBlockchains(meta);
  const chainId = evm.find((chain) => chain.name === network)?.chainId;
  if (!chainId) {
    const error = new Error(`There is no match for ${chainId}`);
    logError(error);
    throw error;
  }
  const chaindIdStr = new ChainId({
    namespace: NAMESPACES.ETHEREUM,
    reference: String(parseInt(chainId)),
  }).toString();

  const session = instance.session;
  const evmNamespace = session.namespaces[NAMESPACES.ETHEREUM];
  const authorizedChains = evmNamespace?.chains || [];
  const authorizedMethods = evmNamespace?.methods || [];

  if (
    authorizedMethods.includes(EthereumRPCMethods.SWITCH_CHAIN) &&
    !ignoreNamespaceMethods(instance)
  ) {
    const currentNetwork = getState?.().network || Networks.ETHEREUM;
    await updateSessionAccounts(instance, network, currentNetwork, meta);
    await switchOrAddEvmChain(meta, network, currentNetwork, instance);
  } else if (authorizedChains.includes(chaindIdStr)) {
    updateChainId(chainId);
    return;
  } else {
    const error = new Error(`Chain ${chainId} is not configured.`);
    logError(error);
    throw error;
  }
};

/**
 *
 * Note:
 * There is no straight-forward way to detect the wallet supports which blockchain,
 * So we send request to wallet and expect to be rejected on the wallet if it's not supported.
 *
 */
export const canSwitchNetworkTo: CanSwitchNetwork = () => true;

export const disconnect: Disconnect = async ({ instance }) => {
  const { client } = instance as WCInstance;

  if (client) {
    void disconnectSessions(client).catch((error) => debug(error));
  }
};

export const getSigners: (provider: WCInstance) => Promise<SignerFactory> =
  signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  return {
    name: 'WalletConnect',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/walletconnect/icon.svg',
    installLink: '',
    color: '#b2dbff',
    supportedChains: evms,
    showOnMobile: true,
    mobileWallet: true,
  };
};
