import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';

import {
  availableWallets,
  checkWalletProviders,
  connectedWallets,
  defaultWalletState,
  getComptaibleProvider,
  state_reducer,
} from './helpers';
import {
  ProviderProps,
  ProviderContext,
  WalletActions,
  WalletConfig,
} from './types';
import { WalletType } from '@rango-dev/wallets-shared';

import Wallet, { EventHandler as WalletEventHandler } from './wallet';

// TODO fix lint problem
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const WalletContext = createContext<ProviderContext>({});

/*
  Our event handler includes an internal state updater, and a notifier
  for the outside listener.
  On creating first wallet refrence, and on chaning `props.onUpdateState`
  we are using this function.
*/
function makeEventHandler(dispatcher: any, onUpdateState?: WalletEventHandler) {
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

function useInitializers(onChangeState: WalletEventHandler) {
  const availableWallets = useRef<{
    [key: string]: Wallet | undefined;
  }>({});

  function updater(wallet: {
    actions: WalletActions;
    config: WalletConfig;
  }): Wallet {
    const type = wallet.config.type;
    // We only update, if there is no instance available.
    if (typeof availableWallets.current[type] === 'undefined') {
      availableWallets.current[type] = new Wallet(
        {
          config: wallet.config,
          handler: onChangeState,
        },
        wallet.actions
      );
    }

    return availableWallets.current[type]!;
  }

  return updater;
}

function Provider(props: ProviderProps) {
  const [providersState, dispatch] = useReducer(state_reducer, {});

  const addWalletRef = useInitializers(
    makeEventHandler(dispatch, props.onUpdateState)
  );
  // const providersRef = useRef<{ [type in WalletType]?: any }>({});

  const listOfProviders = props.providers;
  const wallets = checkWalletProviders(listOfProviders);
  const api: ProviderContext = {
    // TODO: Fix type error
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    async connect(type, network) {
      const wallet = wallets.get(type);
      if (!wallet) {
        throw new Error(`You should add ${type} to provider first.`);
      }

      const ref = addWalletRef(wallet);
      const result = await ref.connect(network);

      return result;
    },
    async disconnect(type) {
      const wallet = wallets.get(type);
      if (!wallet) {
        throw new Error(`You should add ${type} to provider first.`);
      }

      const ref = addWalletRef(wallet);
      await ref.disconnect();
    },
    async disconnectAll() {
      const disconnect_promises: Promise<any>[] = [];

      // When a wallet is initializing, a record will be added to `providersState`
      // So we use them to know what wallet has been initialized then we need to
      // filter connected wallets only.
      connectedWallets(providersState).forEach((type) => {
        const wallet = wallets.get(type);

        if (wallet) {
          const ref = addWalletRef(wallet);
          disconnect_promises.push(ref.disconnect());
        }
      });

      return await Promise.allSettled(disconnect_promises);
    },
    state(type) {
      return providersState[type] || defaultWalletState;
    },
    canSwitchNetworkTo(type, network) {
      const wallet = wallets.get(type);
      if (!wallet) {
        return false;
      }

      const ref = addWalletRef(wallet);
      return ref.canSwitchNetworkTo
        ? ref.canSwitchNetworkTo(network, ref.provider)
        : false;
    },
    providers() {
      const providers: { [type in WalletType]?: any } = {};
      availableWallets(providersState).forEach((type) => {
        const wallet = wallets.get(type);
        if (wallet) {
          const ref = addWalletRef(wallet);
          providers[type] = ref.provider;
        }
      });

      return providers;
    },
    getWalletInfo(type) {
      const wallet = wallets.get(type);
      if (!wallet) {
        throw new Error(`You should add ${type} to provider first.`);
      }

      // Get wallet info could be used in render methods to show wallets data
      // So, addWalletRef method shouldn't be called in this method

      return wallet.actions.getWalletInfo(props.allBlockChains || []);
    },
    getSigners(type) {
      const wallet = wallets.get(type);

      if (!wallet) {
        throw new Error(`You should add ${type} to provider first.`);
      }
      const ref = addWalletRef(wallet);
      const supportedChains = ref.getWalletInfo(
        props.allBlockChains || []
      ).supportedChains;
      const provider = getComptaibleProvider(
        supportedChains,
        ref.provider,
        type
      );
      const result = ref.getSigners(provider);
      return result;
    },
  };

  useEffect(() => {
    wallets.forEach((wallet) => {
      const ref = addWalletRef(wallet);
      const runOnInit = () => {
        if (ref.onInit) {
          ref.onInit();
        }
      };

      const initWhenPageIsReady = (event: Event) => {
        if (
          event.target &&
          (event.target as Document).readyState === 'complete'
        ) {
          runOnInit();

          document.removeEventListener('readystatechange', initWhenPageIsReady);
        }
      };

      // Try to run, maybe it's ready.
      runOnInit();

      // Try again when the page has been completely loaded.
      // Some of wallets, take some time to be fully injected and loaded.
      document.addEventListener('readystatechange', initWhenPageIsReady);
    });
  }, []);

  useEffect(() => {
    const allBlockChains = props.allBlockChains;
    if (allBlockChains) {
      wallets.forEach((wallet) => {
        const ref = addWalletRef(wallet);
        const supportedChains = ref.getWalletInfo(
          props.allBlockChains || []
        ).supportedChains;
        ref.setMeta(supportedChains);
      });
    }
  }, [props.allBlockChains]);

  useEffect(() => {
    wallets.forEach((wallet) => {
      const ref = addWalletRef(wallet);
      ref.setHandler(makeEventHandler(dispatch, props.onUpdateState));
    });
  }, [props.onUpdateState]);

  return (
    <WalletContext.Provider value={api}>
      {props.children}
    </WalletContext.Provider>
  );
}

export function useWallets(): ProviderContext {
  const context = useContext(WalletContext);
  if (!context)
    throw Error('useWallet can only be used within the Provider component');
  return context;
}

export default Provider;
