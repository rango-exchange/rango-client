import type { WCInstance } from './types';
import type {
  CanSwitchNetwork,
  Connect,
  Disconnect,
  GetInstance,
  Subscribe,
  SwitchNetwork,
  WalletConfig,
  WalletInfo,
} from '@yeager-dev/wallets-shared';
import type { ISignClient } from '@walletconnect/types';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import { Networks, WalletTypes } from '@yeager-dev/wallets-shared';
import Client from '@walletconnect/sign-client';
import { AccountId, ChainId } from 'caip';
import { evmBlockchains } from 'rango-types';

import {
  DEFAULT_APP_METADATA,
  DEFAULT_NETWORK,
  EthereumEvents,
  RELAY_URL,
} from './constants';
import {
  createModalInstance,
  simulateRequest,
  switchOrAddEvmChain,
} from './helpers';
import {
  cleanupSingleSession,
  disconnectSessions,
  getAccountsFromEvent,
  getAccountsFromSession,
  getPersistedChainId,
  needSessionRecreateOnSwitchNetwork,
  persistCurrentChainId,
  tryConnect,
  trySwitchByCreatingNewSession,
  updateSessionAccounts,
} from './session';
import signer from './signer';

const WALLET = WalletTypes.WALLET_CONNECT_2;

// TODO: In version 2, It will be moved to constructor.
type Enviroments = Record<string, string>;
let envs: Enviroments = {
  WC_PROJECT_ID: '',
};
export const init = (enviroments: Enviroments) => {
  envs = enviroments;

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

export const connect: Connect = async ({ instance, network, meta }) => {
  const { client } = instance as WCInstance;

  const requestedNetwork = network || DEFAULT_NETWORK;

  // Try to restore the session first, if couldn't, create a new session by showing a modal.
  const { session, isNew } = await tryConnect(client, {
    network: requestedNetwork,
    meta,
  });
  // Override the value (session).
  instance.session = session;
  const currentChainId = !isNew
    ? String(await getPersistedChainId(instance))
    : undefined;
  const accounts = getAccountsFromSession(session, currentChainId);
  /*
   * TODO: we need to fix next lines to support multiple accounts
   * for now, it will return the current evm account on the current chain
   */
  if (!isNew) {
    return {
      chainId: String(currentChainId),
      accounts: accounts?.[0].accounts,
    };
  }
  const newChainId = accounts?.[accounts.length - 1].chainId;
  void persistCurrentChainId(instance, newChainId);
  return accounts?.[accounts.length - 1];
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
      void persistCurrentChainId(instance, chainId);
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
}) => {
  const needRecreateSession = needSessionRecreateOnSwitchNetwork(instance);
  config.isAsyncSwitchNetwork = true;
  if (needRecreateSession) {
    config.isAsyncSwitchNetwork = false;
    /**
     * In case of trust wallet that doesn't support switch chain method,
     * we need to handle it manually by deleting last session and create a new one
     * with correct chain id.
     */
    const session = await trySwitchByCreatingNewSession(instance, {
      network,
      meta,
    });
    instance.session = session;
    return;
  }
  const currentNetwork = getState?.().network || Networks.ETHEREUM;
  await updateSessionAccounts(instance, network, currentNetwork, meta);
  await switchOrAddEvmChain(meta, network, currentNetwork, instance);
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
    void disconnectSessions(client);
  }
};

export const getSigners: (provider: WCInstance) => SignerFactory = signer;

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
