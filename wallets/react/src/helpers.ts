import { WalletConfig, WalletType } from '@rango-dev/wallets-shared';
import Wallet, { Persistor } from '@rango-dev/wallets-core';
import type {
  Options,
  State as WalletState,
  EventHandler as WalletEventHandler,
} from '@rango-dev/wallets-core';
import {
  State,
  WalletActions,
  ProviderInterface,
  WalletProviders,
} from './types';
import { LAST_CONNECTED_WALLETS } from './constants';

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

export async function tryPersistWallet({
  type,
  walletActions,
  getState,
}: {
  type: WalletType;
  walletActions: WalletActions;
  getState: (walletType: WalletType) => WalletState;
}) {
  if (walletActions.canEagerConnect) {
    const persistor = new Persistor<string[]>();
    const wallets = persistor.getItem(LAST_CONNECTED_WALLETS);

    /*
      If on the last attempt we are unable to eagerly connect to any wallet and the user connects any wallet manualy,
      persistance will be outdated and will need to be removed.
    */
    const shouldClearPersistance = wallets?.find(
      (walletType) => !getState(walletType).connected
    );

    if (shouldClearPersistance) clearPersistance();

    const walletAlreadyPersisted = !!wallets?.find((wallet) => wallet === type);
    if (wallets && !walletAlreadyPersisted)
      persistor.setItem(LAST_CONNECTED_WALLETS, wallets.concat(type));
    else persistor.setItem(LAST_CONNECTED_WALLETS, [type]);
  }
}

export function tryRemoveWalletFromPersistance({
  type,
  walletActions,
}: {
  type: WalletType;
  walletActions: WalletActions;
}) {
  if (walletActions.canEagerConnect) {
    const persistor = new Persistor<string[]>();
    const wallets = persistor.getItem(LAST_CONNECTED_WALLETS);
    if (wallets)
      persistor.setItem(
        LAST_CONNECTED_WALLETS,
        wallets.filter((wallet) => wallet !== type)
      );
  }
}

export function clearPersistance() {
  const persistor = new Persistor<string[]>();
  const wallets = persistor.getItem(LAST_CONNECTED_WALLETS);
  if (wallets) persistor.removeItem(LAST_CONNECTED_WALLETS);
}

/*
  If a wallet has multiple providers and one of them can be eagerly connected,
  then the whole wallet will support it at that point and we try to connect to that wallet as usual in eagerConnect method.
*/
export async function autoConnect(
  wallets: WalletProviders,
  getWalletInstance: (wallet: {
    actions: WalletActions;
    config: WalletConfig;
  }) => Wallet<any>
) {
  const persistor = new Persistor<string[]>();
  const lastConnectedWallets = persistor.getItem(LAST_CONNECTED_WALLETS);
  if (lastConnectedWallets && lastConnectedWallets.length) {
    const connect_promises: {
      walletType: WalletType;
      eagerConnect: () => Promise<any>;
    }[] = [];
    lastConnectedWallets.forEach((walletType) => {
      const wallet = wallets.get(walletType);

      if (!!wallet) {
        const walletInstance = getWalletInstance(wallet);
        connect_promises.push({
          walletType,
          eagerConnect: walletInstance.eagerConnect.bind(walletInstance),
        });
      }
    });

    const result = await Promise.allSettled(
      connect_promises.map(({ eagerConnect }) => eagerConnect())
    );

    const canRestoreAnyConnection = !!result.find(
      ({ status }) => status === 'fulfilled'
    );

    /*
      After successfully connecting to at least one wallet,
      we will removing the other wallets from persistence.
      If we are unable to connect to any wallet,
      the persistence will not be removed and the eager connection will be retried with another page load.
     */
    if (canRestoreAnyConnection) {
      const walletsToRemoveFromPersistance: WalletType[] = [];
      result.forEach(({ status }, index) => {
        if (status === 'rejected')
          walletsToRemoveFromPersistance.push(
            connect_promises[index].walletType
          );
      });

      if (walletsToRemoveFromPersistance.length)
        persistor.setItem(
          LAST_CONNECTED_WALLETS,
          lastConnectedWallets.filter(
            (walletType) => !walletsToRemoveFromPersistance.includes(walletType)
          )
        );
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
