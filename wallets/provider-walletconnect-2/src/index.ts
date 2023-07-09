import {
  DEFAULT_APP_METADATA,
  EthereumEvents,
  PROJECT_ID,
  RELAY_URL,
} from './constants';
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
  Networks,
} from '@rango-dev/wallets-shared';
import signer from './signer';
import {
  SignerFactory,
  BlockchainMeta,
  evmBlockchains,
  cosmosBlockchains,
} from 'rango-types';
// import Client from '@walletconnect/sign-client';
import { SignClient } from '@walletconnect/sign-client/dist/types/client';
import {
  cleanupSessions,
  getAccountsFromEvent,
  getAccountsFromSession,
  getLastSession,
  tryConnect,
  tryUpdate,
} from './session';
import { SessionTypes } from '@walletconnect/types';
import Client from '@walletconnect/sign-client';
import { getChainIdByNetworkName } from './helpers';
import { ChainId } from 'caip';

const WALLET = WalletTypes.WALLET_CONNECT_2;

export interface Instance {
  client: SignClient;
  session: SessionTypes.Struct | null;
}

export const config: WalletConfig = {
  type: WALLET,
  checkInstallation: false,
  isAsyncInstance: true,
  defaultNetwork: Networks.ETHEREUM,
};

export const getInstance: GetInstance = async (options) => {
  const { network, meta, force, updateChainId, currentProvider } = options;

  // Supported chains by us
  const evm = evmBlockchains(meta);
  const cosmos = cosmosBlockchains(meta);

  // Create a new pair, if exists use the pair.
  // Or use already created.
  let provider: SignClient;
  if (force || !currentProvider) {
    provider = await Client.init({
      relayUrl: RELAY_URL,
      projectId: PROJECT_ID,
      metadata: DEFAULT_APP_METADATA,
    });
  } else {
    provider = currentProvider;
  }

  // TODO: how about Solana?
  const requestedChain = [...evm, ...cosmos].find(
    (chain) => chain.name === network
  );
  if (force && !!requestedChain?.chainId) {
    updateChainId(requestedChain.chainId);
  }

  return {
    client: provider,
    session: null,
    request: async (params: any) => {
      if (params.method === 'eth_chainId') {
        const currentSession = getLastSession(provider);
        const standaloneChains = Object.values(currentSession.namespaces)
          .map((namespace) => namespace.chains)
          .flat() as string[];

        if (standaloneChains.length > 0) {
          const firstChain = standaloneChains[0];
          const chainId = new ChainId(firstChain);
          return chainId.reference;
        } else {
          throw new Error(`Couldn't find any chain on namespace`);
        }
      }
      throw new Error('Dissallowed method:', params);
    },
  };
};

// TODO: handle error
// {context: 'core'}context: "core"[[Prototype]]: Object {context: 'core/expirer'} 'No matching key. expirer: topic:d6b1eb9c6ac06c2b07a61848bcb7156a4fbb823e76384acc4592f35a9b5e7950'
export const connect: Connect = async ({ instance, network, meta }) => {
  const { client } = instance as Instance;

  const requestedChainId = getChainIdByNetworkName(network, meta);
  console.log({ meta, network, instance, requestedChainId });

  const session = await tryConnect(client, {
    network,
    meta,
  });
  // Overriding the value.
  instance.session = session;

  const accounts = getAccountsFromSession(session);

  console.log({
    session,
    accounts,
  });
  return accounts;
};

// TODO: we should always check upcoming `topic` from events with what we have in our session.
export const subscribe: Subscribe = ({
  instance,
  updateChainId,
  updateAccounts,
  disconnect,
}) => {
  console.log('subscribe subscribe subscribe');
  const { client } = instance as Instance;

  client.on('session_update', (args) => {
    console.log(`[session_update]`, args);
    const allAccounts = getAccountsFromEvent(args);
    allAccounts.forEach((accountsWithChain) => {
      updateAccounts(accountsWithChain.accounts, accountsWithChain.chainId);
    });
  });

  client.on('session_event', (args) => {
    console.log(`[session_event]`, args);

    if (args.params.event.name === EthereumEvents.ACCOUNTS_CHANGED) {
      const accounts = args.params.event.data;
      const chainId = args.params.chainId;
      updateAccounts(accounts);
      updateChainId(chainId);
    } else if (args.params.event.name === EthereumEvents.CHAIN_CHANGED) {
      const chainId = args.params.chainId;
      updateChainId(chainId);
    } else {
      console.log('[WC2] session_event not supported', args.params.event);
    }
  });

  client.on('session_delete', async (event) => {
    console.log('received disconnect event...', event);

    cleanupSessions(client);
    disconnect();
  });

  client.on('session_proposal', async (event) => {
    console.log(
      'session_proposal session_proposal session_proposal session_proposal session_proposal',
      event
    );
  });
  client.on('session_request', async (event) => {
    console.log(
      'session_request session_request session_request session_request session_request',
      event
    );
  });
};

export const switchNetwork: SwitchNetwork = async ({
  network,
  instance,
  meta,
}) => {
  console.log('[switch network] request', network);
  tryUpdate(instance, { network, meta });
};

export const canSwitchNetworkTo: CanSwitchNetwork = () => false;
export const disconnect: Disconnect = async ({ instance }) => {
  console.log('doing disconnect action...');
  const { client } = instance as Instance;

  if (client) {
    cleanupSessions(client);
  }
};

export const getSigners: (provider: Instance) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  return {
    name: 'WalletConnect 2',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/icons/wallets/walletconnect.svg',
    installLink: '',
    color: '#b2dbff',
    supportedChains: allBlockChains,
    showOnMobile: true,
    mobileWallet: true,
  };
};
