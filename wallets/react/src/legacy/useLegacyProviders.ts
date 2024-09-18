import type { ProviderContext, ProviderProps } from './types.js';
import type { WalletType } from '@rango-dev/wallets-shared';

import { useEffect, useReducer } from 'react';

import {
  availableWallets,
  checkWalletProviders,
  clearPersistance,
  connectedWallets,
  defaultWalletState,
  makeEventHandler,
  stateReducer,
  tryPersistWallet,
  tryRemoveWalletFromPersistance,
} from './helpers.js';
import { useInitializers } from './hooks.js';
import { useAutoConnect } from './useAutoConnect.js';

export function useLegacyProviders(props: ProviderProps): ProviderContext {
  const [providersState, dispatch] = useReducer(stateReducer, {});

  // Get (or add) wallet instance (`provider`s will be wrapped in a `Wallet`)
  const getWalletInstance = useInitializers(
    makeEventHandler(dispatch, props.onUpdateState)
  );

  // Getting providers from props and put all of them in a `Map` with an appropriate interface.
  const listOfProviders = props.providers;
  const wallets = checkWalletProviders(listOfProviders);

  useAutoConnect({
    wallets,
    allBlockChains: props.allBlockChains,
    autoConnect: props.autoConnect,
    getWalletInstanceFromLegacy: getWalletInstance,
  });

  // Final API we put in context and it will be available to use for users.
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const api: ProviderContext = {
    async connect(type, network, namespaces) {
      const wallet = wallets.get(type);
      if (!wallet) {
        throw new Error(`You should add ${type} to provider first.`);
      }
      const walletInstance = getWalletInstance(wallet);
      const result = await walletInstance.connect(network, namespaces);
      if (props.autoConnect) {
        void tryPersistWallet({
          type,
          walletActions: wallet.actions,
          getState: api.state,
        });
      }

      return result;
    },
    async disconnect(type) {
      const wallet = wallets.get(type);
      if (!wallet) {
        throw new Error(`You should add ${type} to provider first.`);
      }

      const walletInstance = getWalletInstance(wallet);
      await walletInstance.disconnect();
      if (props.autoConnect) {
        tryRemoveWalletFromPersistance({ type, walletActions: wallet.actions });
      }
    },
    async disconnectAll() {
      const disconnect_promises: Promise<any>[] = [];

      /*
       * When a wallet is initializing, a record will be added to `providersState`
       * So we use them to know what wallet has been initialized then we need to
       * filter connected wallets only.
       */
      connectedWallets(providersState).forEach((type) => {
        const wallet = wallets.get(type);

        if (wallet) {
          const walletInstance = getWalletInstance(wallet);
          disconnect_promises.push(walletInstance.disconnect());
        }
      });

      if (props.autoConnect) {
        clearPersistance();
      }
      return await Promise.allSettled(disconnect_promises);
    },

    async suggestAndConnect(type, network) {
      const wallet = wallets.get(type);
      if (!wallet) {
        throw new Error(`You should add ${type} to provider first.`);
      }
      const walletInstance = getWalletInstance(wallet);
      const result = await walletInstance.suggestAndConnect(network);

      return result;
    },

    state(type) {
      return providersState[type] || defaultWalletState;
    },
    canSwitchNetworkTo(type, network) {
      const wallet = wallets.get(type);
      if (!wallet) {
        return false;
      }

      const walletInstance = getWalletInstance(wallet);
      return walletInstance.canSwitchNetworkTo
        ? walletInstance.canSwitchNetworkTo(network, walletInstance.provider)
        : false;
    },
    providers() {
      const providers: { [type in WalletType]?: any } = {};
      availableWallets(providersState).forEach((type) => {
        const wallet = wallets.get(type);
        if (wallet) {
          const walletInstance = getWalletInstance(wallet);
          providers[type] = walletInstance.provider;
        }
      });

      return providers;
    },
    getWalletInfo(type) {
      const wallet = wallets.get(type);
      if (!wallet) {
        throw new Error(`You should add ${type} to provider first.`);
      }

      /*
       * Get wallet info could be used in render methods to show wallets data
       * So, addWalletRef method shouldn't be called in this method
       */

      return wallet.actions.getWalletInfo(props.allBlockChains || []);
    },
    async getSigners(type) {
      const wallet = wallets.get(type);

      if (!wallet) {
        throw new Error(`You should add ${type} to provider first.`);
      }
      const walletInstance = getWalletInstance(wallet);
      const provider = walletInstance.provider;
      const result = walletInstance.getSigners(provider);

      return result;
    },
  };

  // Initialize instances
  useEffect(() => {
    wallets.forEach((wallet) => {
      const walletInstance = getWalletInstance(wallet);
      const runOnInit = () => {
        if (walletInstance.onInit) {
          walletInstance.onInit();
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

      /*
       * Try again when the page has been completely loaded.
       * Some of wallets, take some time to be fully injected and loaded.
       */
      document.addEventListener('readystatechange', initWhenPageIsReady);
    });
  }, []);

  // Setting supported blockchains on instances
  useEffect(() => {
    const allBlockChains = props.allBlockChains;
    if (allBlockChains) {
      wallets.forEach((wallet) => {
        const walletInstance = getWalletInstance(wallet);
        const walletInfo = walletInstance.getWalletInfo(
          props.allBlockChains || []
        );
        walletInstance.setInfo({
          supportedBlockchains: walletInfo.supportedChains,
          isContractWallet: !!walletInfo.isContractWallet,
        });
      });
    }
  }, [props.allBlockChains]);

  // Setting event handler on instances
  useEffect(() => {
    wallets.forEach((wallet) => {
      const walletInstance = getWalletInstance(wallet);
      walletInstance.setHandler(
        makeEventHandler(dispatch, props.onUpdateState)
      );
    });
  }, [props.onUpdateState]);

  return api;
}
