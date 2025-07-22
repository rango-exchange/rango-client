import type {
  ProviderInterface,
  State,
  WalletActions,
  WalletProviders,
} from './types.js';
import type {
  LegacyOptions as Options,
  LegacyEventHandler as WalletEventHandler,
  LegacyState as WalletState,
} from '@arlert-dev/wallets-core/legacy';
import type { WalletType } from '@arlert-dev/wallets-shared';

import { Persistor } from '@arlert-dev/wallets-core/legacy';

import { LEGACY_LAST_CONNECTED_WALLETS } from '../hub/constants.js';
import { LastConnectedWalletsFromStorage } from '../hub/lastConnectedWallets.js';

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

export function stateReducer(state: State, action: any) {
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
    const lastConnectedWalletsFromStorage = new LastConnectedWalletsFromStorage(
      LEGACY_LAST_CONNECTED_WALLETS
    );
    const lastConnectedWallets = lastConnectedWalletsFromStorage.list();
    const walletAlreadyPersisted = !!lastConnectedWallets[type];

    /*
     *If on the last attempt we are unable to eagerly connect to any wallet and the user connects any wallet manualy,
     *persistance will be outdated and will need to be removed.
     */
    if (walletAlreadyPersisted && !getState(type).connected) {
      clearPersistance();
    }

    if (!walletAlreadyPersisted) {
      lastConnectedWalletsFromStorage.addWallet(type, []);
    }
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
    const lastConnectedWalletsFromStorage = new LastConnectedWalletsFromStorage(
      LEGACY_LAST_CONNECTED_WALLETS
    );
    lastConnectedWalletsFromStorage.removeWallets([type]);
  }
}

export function clearPersistance() {
  const persistor = new Persistor<string[]>();
  const wallets = persistor.getItem(LEGACY_LAST_CONNECTED_WALLETS);
  if (wallets) {
    persistor.removeItem(LEGACY_LAST_CONNECTED_WALLETS);
  }
}

/*
 *Our event handler includes an internal state updater, and a notifier
 *for the outside listener.
 *On creating first wallet refrence, and on chaning `props.onUpdateState`
 *we are using this function.
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
