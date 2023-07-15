import React, { useEffect, useReducer } from 'react';

import {
  autoConnect,
  availableWallets,
  checkWalletProviders,
  clearPersistStorage,
  connectedWallets,
  defaultWalletState,
  getComptaibleProvider,
  persistWallet,
  removeWalletFromPersist,
  makeEventHandler,
  state_reducer,
} from './helpers';
import { ProviderProps, ProviderContext } from './types';
import { WalletType } from '@rango-dev/wallets-shared';
import { useInitializers } from './hooks';
import { WalletContext } from './context';

function Provider(props: ProviderProps) {
  const [providersState, dispatch] = useReducer(state_reducer, {});

  // Get (or add) wallet instance (`provider`s will be wraped in a `Wallet`)
  const getWalletInstance = useInitializers(
    makeEventHandler(dispatch, props.onUpdateState)
  );

  // Getting providers from props and put all of them in a `Map` with an appropriate interface.
  const listOfProviders = props.providers;
  const wallets = checkWalletProviders(listOfProviders);

  // Final API we put in context and it will be available to use for users.
  const api: ProviderContext = {
    async connect(type, network) {
      const wallet = wallets.get(type);
      if (!wallet) {
        throw new Error(`You should add ${type} to provider first.`);
      }

      const walletInstance = getWalletInstance(wallet);
      const result = await walletInstance.connect(network);
      if (props.autoConnect) persistWallet(type);

      return result;
    },
    async disconnect(type) {
      const wallet = wallets.get(type);
      if (!wallet) {
        throw new Error(`You should add ${type} to provider first.`);
      }

      const walletInstance = getWalletInstance(wallet);
      await walletInstance.disconnect();
      if (props.autoConnect) removeWalletFromPersist(type);
    },
    async disconnectAll() {
      const disconnect_promises: Promise<any>[] = [];

      // When a wallet is initializing, a record will be added to `providersState`
      // So we use them to know what wallet has been initialized then we need to
      // filter connected wallets only.
      connectedWallets(providersState).forEach((type) => {
        const wallet = wallets.get(type);

        if (wallet) {
          const walletInstance = getWalletInstance(wallet);
          disconnect_promises.push(walletInstance.disconnect());
        }
      });

      if (props.autoConnect) clearPersistStorage();
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

      // Get wallet info could be used in render methods to show wallets data
      // So, addWalletRef method shouldn't be called in this method

      return wallet.actions.getWalletInfo(props.allBlockChains || []);
    },
    getSigners(type) {
      const wallet = wallets.get(type);

      if (!wallet) {
        throw new Error(`You should add ${type} to provider first.`);
      }
      const walletInstance = getWalletInstance(wallet);
      const supportedChains = walletInstance.getWalletInfo(
        props.allBlockChains || []
      ).supportedChains;
      const provider = getComptaibleProvider(
        supportedChains,
        walletInstance.provider,
        type
      );
      const result = walletInstance.getSigners(provider);

      return result;
    },
  };

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

      // Try again when the page has been completely loaded.
      // Some of wallets, take some time to be fully injected and loaded.
      document.addEventListener('readystatechange', initWhenPageIsReady);
    });
  }, []);

  useEffect(() => {
    const allBlockChains = props.allBlockChains;
    if (allBlockChains) {
      wallets.forEach((wallet) => {
        const walletInstance = getWalletInstance(wallet);
        const supportedChains = walletInstance.getWalletInfo(
          props.allBlockChains || []
        ).supportedChains;
        walletInstance.setMeta(supportedChains);
      });
    }
  }, [props.allBlockChains]);

  useEffect(() => {
    wallets.forEach((wallet) => {
      const walletInstance = getWalletInstance(wallet);
      walletInstance.setHandler(
        makeEventHandler(dispatch, props.onUpdateState)
      );
    });
  }, [props.onUpdateState]);

  useEffect(() => {
    const shouldTryAutoConnect =
      props.allBlockChains && props.allBlockChains.length && props.autoConnect;
    if (shouldTryAutoConnect) {
      (async () => {
        await autoConnect(wallets, getWalletInstance);
      })();
    }
  }, [props.autoConnect, props.allBlockChains]);

  return (
    <WalletContext.Provider value={api}>
      {props.children}
    </WalletContext.Provider>
  );
}

export default Provider;
