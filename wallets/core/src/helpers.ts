import WalletConnectProvider from '@walletconnect/ethereum-provider';
import {
  convertEvmBlockchainMetaToEvmChainInfo,
  evmChainsToRpcMap,
  Network,
  WalletConfig,
  WalletType,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import {
  State,
  WalletActions,
  ProviderInterface,
  WalletProviders,
} from './types';
import Wallet, { Options, State as WalletState } from './wallet';
import type { BlockchainMeta } from 'rango-types';
import { isEvmBlockchain } from 'rango-types';
import { Persistor } from './persistor';
import { LASTE_CONNECTED_WALLETS } from './constants';
import type { EventHandler as WalletEventHandler } from './wallet';

export function choose(wallets: any[], type: WalletType): any | null {
  return wallets.find((wallet) => wallet.type === type) || null;
}

export const defaultWalletState: WalletState = {
  connected: false,
  connecting: false,
  reachable: false,
  installed: false,
  accounts: null,
  network: null,
};

export function state_reducer(state: State, action: any) {
  if (action.type === 'new_state') {
    // TODO fix problem and remove ts-ignore
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const target_wallet = state[action.wallet];
    if (!target_wallet) {
      return {
        ...state,
        [action.wallet]: {
          ...defaultWalletState,
          [action.name]: action.value,
        },
      };
    }

    return {
      ...state,
      [action.wallet]: {
        ...target_wallet,
        [action.name]: action.value,
      },
    };
  }

  return state;
}

export function formatAddressWithNetwork(
  address: string,
  network?: Network | null
) {
  return `${network || ''}:${address}`;
}

export function accountAddressesWithNetwork(
  addresses: string[] | null,
  network?: Network | null
) {
  if (!addresses) return [];

  return addresses.map((address) => {
    return formatAddressWithNetwork(address, network);
  });
}

export function readAccountAddress(addressWithNetwork: string): {
  address: string;
  network: Network;
} {
  const [network, address] = addressWithNetwork.split(':');

  return {
    network,
    address,
  };
}

export function connectedWallets(providersState: State): WalletType[] {
  return Object.entries(providersState)
    .filter(([, wallet_state]) => {
      return wallet_state?.connected;
    })
    .map(([type]) => {
      return type;
    });
}

export function availableWallets(providersState: State): WalletType[] {
  return Object.entries(providersState).map(([type]) => {
    return type;
  });
}

export function checkWalletProviders(
  list: ProviderInterface[]
): WalletProviders {
  const wallets: WalletProviders = new Map();

  list.forEach((provider) => {
    const { config, ...actions } = provider;
    wallets.set(config.type, {
      actions,
      config,
    });
  });

  return wallets;
}

/* eslint-disable @typescript-eslint/ban-types */
export function isAsync(fn: Function) {
  return fn?.constructor?.name === 'AsyncFunction';
}

export function needsCheckInstallation(options: Options) {
  const { checkInstallation = true } = options.config;
  return checkInstallation;
}

/*
  WalletConnect instance is not compatible with ethers.providers.Web3Provider,
  Here we are returning a comptable instance, instead of the original one.  
*/
export function isWalletDerivedFromWalletConnect(wallet_type: WalletType) {
  return wallet_type === WalletTypes.WALLET_CONNECT;
}
export function getComptaibleProvider(
  supportedChains: BlockchainMeta[],
  provider: any,
  type: WalletType
) {
  if (isWalletDerivedFromWalletConnect(type)) {
    const evmBlockchains = supportedChains.filter(isEvmBlockchain);
    const rpcUrls = evmChainsToRpcMap(
      convertEvmBlockchainMetaToEvmChainInfo(evmBlockchains)
    );
    console.log(rpcUrls);
    return new WalletConnectProvider({
      qrcode: false,
      rpc: rpcUrls,
      connector: provider,
      chainId: provider.chainId,
    });
  }
  return provider;
}

export async function persistWallet(type: WalletType) {
  const persistor = new Persistor<string[]>();
  const wallets = persistor.getItem(LASTE_CONNECTED_WALLETS);
  const walletAlreadyPersisted = !!wallets?.find((wallet) => wallet === type);
  if (wallets && !walletAlreadyPersisted)
    persistor.setItem(LASTE_CONNECTED_WALLETS, wallets.concat(type));
  else persistor.setItem(LASTE_CONNECTED_WALLETS, [type]);
}

export function removeWalletFromPersist(type: WalletType) {
  const persistor = new Persistor<string[]>();
  const wallets = persistor.getItem(LASTE_CONNECTED_WALLETS);
  if (wallets)
    persistor.setItem(
      LASTE_CONNECTED_WALLETS,
      wallets.filter((wallet) => wallet !== type)
    );
}

export function clearPersistStorage() {
  const persistor = new Persistor<string[]>();
  const wallets = persistor.getItem(LASTE_CONNECTED_WALLETS);
  if (wallets) persistor.removeItem(LASTE_CONNECTED_WALLETS);
}

export async function autoConnect(
  wallets: WalletProviders,
  addWalletRef: (wallet: {
    actions: WalletActions;
    config: WalletConfig;
  }) => Wallet<any>
) {
  const persistor = new Persistor<string[]>();
  const lastConnectedWallets = persistor.getItem(LASTE_CONNECTED_WALLETS);
  if (lastConnectedWallets && lastConnectedWallets.length) {
    const connect_promises: {
      walletType: WalletType;
      connect: () => Promise<any>;
    }[] = [];
    lastConnectedWallets.forEach((walletType) => {
      const wallet = wallets.get(walletType);

      if (!!wallet) {
        const ref = addWalletRef(wallet);
        connect_promises.push({ walletType, connect: ref.connect.bind(ref) });
      }
    });

    for (const { connect, walletType } of connect_promises) {
      try {
        await connect();
      } catch (error) {
        removeWalletFromPersist(walletType);
      }
    }
  }
}
/*
  Our event handler includes an internal state updater, and a notifier
  for the outside listener.
  On creating first wallet refrence, and on chaning `props.onUpdateState`
  we are using this function.
*/
export function makeEventHandler(
  dispatcher: any,
  onUpdateState?: WalletEventHandler
) {
  const handler: WalletEventHandler = (
    type,
    name,
    value,
    coreState,
    supportedChains
  ) => {
    const action = { type: 'new_state', wallet: type, name, value };
    // Update state
    dispatcher(action);

    // Giving the event to the outside listener
    if (onUpdateState) {
      onUpdateState(type, name, value, coreState, supportedChains);
    }
  };

  return handler;
}
