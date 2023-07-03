import { DEFAULT_APP_METADATA, PROJECT_ID, RELAY_URL } from './constants';
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
import { cleanupSessions, getAccountsFromSession, tryConnect } from './session';
import { SessionTypes, SignClientTypes } from '@walletconnect/types';
import Client from '@walletconnect/sign-client';

const WALLET = WalletTypes.WALLET_CONNECT_2;

export interface Instance {
  client: SignClient;
  session: SessionTypes.Struct | null;
}

export const config: WalletConfig = {
  type: WALLET,
  checkInstallation: false,
  isAsyncInstance: true,
  defaultNetwork: Networks.COSMOS,
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
  };
};

// TODO: handle error
// {context: 'core'}context: "core"[[Prototype]]: Object {context: 'core/expirer'} 'No matching key. expirer: topic:d6b1eb9c6ac06c2b07a61848bcb7156a4fbb823e76384acc4592f35a9b5e7950'
export const connect: Connect = async ({ instance, network, meta }) => {
  const { client } = instance as Instance;
  console.log({ meta, network });

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

export const subscribe: Subscribe = ({
  instance,
  // updateChainId,
  // updateAccounts,
  // meta,
  // connect,
  disconnect,
}) => {
  const { client } = instance as Instance;
  // client?.on('chainChanged', (chainId: string) => {
  //   console.log('111111111');
  //   const network = getBlockChainNameFromId(chainId, meta) || Networks.Unknown;

  //   updateChainId(chainId);
  //   connect(network);
  // });
  // // Subscribe to connection events
  // client.on('connect', (error: any, payload: any) => {
  //   if (error) {
  //     throw error;
  //   }

  //   const { accounts, chainId } = payload.params[0];

  //   updateAccounts(accounts);
  //   updateChainId(chainId);
  // });

  // client.on('session_update', (error: any, payload: any) => {
  //   console.log(3333);
  //   if (error) {
  //     throw error;
  //   }

  //   // Get updated accounts and chainId
  //   const { accounts, chainId } = payload.params[0];
  //   updateAccounts(accounts);
  //   updateChainId(chainId);
  // });

  // client.on('session_event', (error: any, payload: any) => {
  //   if (error) {
  //     throw error;
  //   }
  //   // Get updated accounts and chainId
  //   const { accounts, chainId } = payload.params[0];
  //   updateAccounts(accounts);
  //   updateChainId(chainId);
  // });

  client.on(
    'session_delete',
    async (_event: SignClientTypes.EventArguments['session_delete']) => {
      console.log('received disconnect event...');

      cleanupSessions(client);
      disconnect();
    }
  );
};

export const switchNetwork: SwitchNetwork = async ({
  network,
  instance,
  meta,
}) => {
  connect({ network, instance, meta });
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
