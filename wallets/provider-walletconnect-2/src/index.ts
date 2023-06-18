import {
  DEFAULT_APP_METADATA,
  generateOptionalNamespace,
  generateRequiredNamespace,
  PROJECT_ID,
  RELAY_URL,
} from './helpers';
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
} from '@rango-dev/wallets-shared';
import signer from './signer';
import {
  SignerFactory,
  BlockchainMeta,
  evmBlockchains,
  cosmosBlockchains,
} from 'rango-types';
import Client from '@walletconnect/sign-client';
import { SignClient } from '@walletconnect/sign-client/dist/types/client';
import { Web3Modal } from '@web3modal/standalone';
import { SessionTypes } from '@walletconnect/types';
import { AccountId } from 'caip';

/**
 * Web3Modal Config
 */
const web3Modal = new Web3Modal({
  projectId: PROJECT_ID,
  themeMode: 'light',
  walletConnectVersion: 2,
});

const WALLET = WalletTypes.WALLET_CONNECT_2;

// cip34 => Cardano
// eip155 => Evm
export enum NAMESPACES {
  ETHEREUM = 'eip155',
  SOLANA = 'solana',
  COSMOS = 'cosmos',
  POLKADOT = 'polkadot',
  CARDANO = 'cip34',
  ERLOND = 'elrond',
  MULTIVERSX = 'multiversx',
}

// Refrence: https://docs.walletconnect.com/2.0/advanced/rpc-reference/solana-rpc
enum SolanaRPCMethods {
  GET_ACCOUNTS = 'solana_getAccounts',
  REQUEST_ACCOUNTS = 'solana_requestAccounts',
  SIGN_TRANSACTION = 'solana_signTransaction',
  SIGN_MESSAGE = 'solana_signMessage',
}

// Refrence: https://docs.walletconnect.com/2.0/advanced/rpc-reference/cosmos-rpc
enum CosmosRPCMethods {
  GET_ACCOUNTS = 'cosmos_getAccounts',
  SIGN_DIRECT = 'cosmos_signDirect',
  SIGN_AMINO = 'cosmos_signAmino',
}

// Refrence: https://docs.walletconnect.com/2.0/advanced/rpc-reference/ethereum-rpc
enum EthereumRPCMethods {
  PERSONAL_SIGN = 'personal_sign',
  SIGN = 'eth_sign',
  SIGN_TYPED_DATA = 'eth_signTypedData',
  SIGN_TRANSACTION = 'eth_signTransaction',
  SEND_TRANSACTION = 'eth_sendTransaction',
  SEND_RAW_TRANSACTION = 'eth_sendRawTransaction',
}

// TODO: Do we need Starknet?
// enum StarknetRPCMethods {
//   REQUEST_ADD_INVOKE_TRANSACTION = 'starknet_requestAddInvokeTransaction',
//   SIGN_TYPED_DATA = 'starknet_signTypedData',
// }

export const DEFAULT_ETHEREUM_EVENTS = ['chainChanged', 'accountsChanged'];
export const DEFAULT_ETHEREUM_METHODS = [
  EthereumRPCMethods.SEND_TRANSACTION,
  EthereumRPCMethods.SIGN_TRANSACTION,
];
export const DEFAULT_SOLANA_METHODS = [SolanaRPCMethods.SIGN_TRANSACTION];
export const DEFAULT_COSMOS_METHODS = [
  CosmosRPCMethods.GET_ACCOUNTS,
  CosmosRPCMethods.SIGN_AMINO,
  CosmosRPCMethods.SIGN_DIRECT,
];

// refrence: https://github.com/ChainAgnostic/namespaces/blob/main/solana/caip2.md
export const DEFAULT_SOLANA_CHAIN_ID = '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp';

export const config: WalletConfig = {
  type: WALLET,
  checkInstallation: false,
  isAsyncInstance: true,
};

export const getInstance: GetInstance = async (options) => {
  const { network, meta, force, updateChainId, currentProvider } = options;

  // Supported chains by us
  const evm = evmBlockchains(meta);
  const cosmos = cosmosBlockchains(meta);

  // Create a new pair, if exists use the pair.
  // Or use already created.
  let provider;
  if (force || !currentProvider) {
    provider = Client.init({
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
    updateChainId?.(requestedChain.chainId);
  }

  return provider;
};

export const connect: Connect = async ({ instance, network, meta }) => {
  const client = instance as SignClient;
  const pairings = client.pairing.getAll({ active: true });
  const lastPairing =
    pairings.length > 0 ? pairings[pairings.length - 1] : undefined;

  console.log({ pairings, lastPairing });

  // If `network` is provided, trying to get chainId. Otherwise, fallback to eth.
  const requiredNamespaces = network
    ? generateRequiredNamespace(meta, network)
    : generateRequiredNamespace(meta, Networks.ETHEREUM);

  // Otherwise we try to get all of them as optional
  const optionalNamespaces = generateOptionalNamespace(meta);

  console.log({ requiredNamespaces, optionalNamespaces });

  let session: SessionTypes.Struct;
  try {
    const { uri, approval } = await client.connect({
      pairingTopic: lastPairing?.topic,
      requiredNamespaces,
      optionalNamespaces,
    });

    // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
    if (uri) {
      // Create a flat array of all requested chains across namespaces.
      const allNamespaces = {
        ...(requiredNamespaces || {}),
        ...(optionalNamespaces || {}),
      };

      const standaloneChains = Object.values(allNamespaces)
        .map((namespace) => namespace.chains)
        .flat() as string[];

      web3Modal.openModal({ uri, standaloneChains });
    }

    session = await approval();
    console.log('Established session:', session);
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    // close modal in case it was open
    web3Modal.closeModal();
  }

  // TODO: I'm not sure this will work as expected on multiple account on a chain.
  // TODO: chainId is like eip155, do we need to change it?
  const accounts = Object.values(session.namespaces)
    .map((namespace) => namespace.accounts)
    .flat()
    .map((account) => {
      const { address, chainId } = new AccountId(account);
      return {
        accounts: [address],
        chainId: chainId.toString(),
      };
    });

  console.log({
    session,
  });
  return accounts;
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
  instance,
  meta,
}) => {
  connect({ network, instance, meta });
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
