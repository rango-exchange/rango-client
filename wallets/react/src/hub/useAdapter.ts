import type { ProviderContext, ProviderProps } from '../legacy/types';
import type {
  NamespaceAndNetwork,
  Namespaces,
  Store,
  V1,
  Versions,
} from '@rango-dev/wallets-core';
import type { WalletInfo } from '@rango-dev/wallets-shared';

import {
  createStore,
  Hub,
  isDiscoverMode,
  isEvmNamespace,
} from '@rango-dev/wallets-core';
import { useEffect, useRef, useState } from 'react';

import { addWalletToStorage, removeWalletsFromStorage } from './autoConnect';
import { fromAccountIdToLegacyAddressFormat } from './helpers';
import { useAutoConnect } from './useAutoConnect';
import {
  checkHubStateAndTriggerEvents,
  convertNamespaceNetworkToEvmChainId,
  discoverNamespace,
  getLegacyProvider,
} from './utils';

export type UseAdapterProps = Omit<ProviderProps, 'providers'> & {
  providers: V1[];
  // This is only will be used to access some parts of the legacy provider that doesn't exists in Hub.
  __all: Versions[];
};

export function useAdapter(props: UseAdapterProps): ProviderContext {
  const store = useRef<Store>(null);
  // https://react.dev/reference/react/useRef#avoiding-recreating-the-ref-contents
  function getStore() {
    if (store.current !== null) {
      return store.current;
    }
    const createdStore = createStore();
    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    store.current = createdStore;
    return createdStore;
  }

  const hub = useRef<Hub>(null);
  function getHub(): Hub {
    if (hub.current !== null) {
      return hub.current;
    }
    const createdHub = new Hub({
      store: getStore(),
    });
    /*
     * First add providers to hub
     * This helps to `getWalletInfo` be usable, before initialize.
     */
    props.providers.forEach((provider) => {
      createdHub.add(provider.id, provider);
    });

    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    hub.current = createdHub;
    return createdHub;
  }
  const [, rerender] = useState(0);
  // useEffect will run `subscribe` once, so we need a reference and mutate the value if it's changes.
  const dataRef = useRef({
    onUpdateState: props.onUpdateState,
    __all: props.__all,
    allBlockChains: props.allBlockChains,
  });

  useEffect(() => {
    dataRef.current = {
      onUpdateState: props.onUpdateState,
      __all: props.__all,
      allBlockChains: props.allBlockChains,
    };
  }, [props]);

  // Initialize instances
  useEffect(() => {
    // Then will call init whenever page is ready.
    const initHubWhenPageIsReady = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        getHub().init();

        rerender((currentRender) => currentRender + 1);
      }
    };

    /*
     * Try again when the page has been completely loaded.
     * Some of wallets, take some time to be fully injected and loaded.
     */
    document.addEventListener('readystatechange', initHubWhenPageIsReady);

    getStore().subscribe((curr, prev) => {
      if (dataRef.current.onUpdateState) {
        checkHubStateAndTriggerEvents(
          getHub(),
          curr,
          prev,
          dataRef.current.onUpdateState,
          dataRef.current.__all,
          dataRef.current.allBlockChains
        );
      }
      rerender((currentRender) => currentRender + 1);
    });
  }, []);

  useAutoConnect({
    getHub,
    autoConnect: props.autoConnect,
    allBlockChains: props.allBlockChains,
    allProviders: props.__all,
  });

  return {
    canSwitchNetworkTo(type, network) {
      const provider = getLegacyProvider(props.__all, type);
      const switchTo = provider.canSwitchNetworkTo;

      if (!switchTo) {
        return false;
      }

      return switchTo({
        network,
        meta: props.allBlockChains || [],
        provider: provider.getInstance(),
      });
    },
    async connect(type, namespaces) {
      const wallet = getHub().get(type);
      if (!wallet) {
        throw new Error(
          `You should add ${type} to provider first then call 'connect'.`
        );
      }

      if (!namespaces) {
        /*
         * TODO: I think this should be wallet.connect()
         * TODO: This isn't needed anymore since we can add a discovery namespace.
         * TODO: if the next line uncomnented, make sure we are handling autoconnect persist as well.
         * return getHub().runAll('connect');
         */
        throw new Error(
          'Passing namespace to `connect` is required. you can pass DISCOVERY_MODE for legacy.'
        );
      }

      // TODO: CommonBlockchains somehow.
      const targetNamespaces: [NamespaceAndNetwork, object][] = [];
      namespaces.forEach((namespace) => {
        let targetNamespace: Namespaces;
        if (isDiscoverMode(namespace)) {
          targetNamespace = discoverNamespace(namespace.network);
        } else {
          targetNamespace = namespace.namespace;
        }

        const result = wallet.findBy({
          namespace: targetNamespace,
        });

        if (!result) {
          throw new Error(
            `We couldn't find any provider matched with your request namespace. (requested namespace: ${namespace.namespace})`
          );
        }

        targetNamespaces.push([namespace, result]);
      });

      const finalResult = targetNamespaces.map(([info, namespace]) => {
        const evmChain = isEvmNamespace(info)
          ? convertNamespaceNetworkToEvmChainId(
              info,
              props.allBlockChains || []
            )
          : undefined;
        const chain = evmChain || info.network;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore-next-line
        return namespace.connect(chain);
      });

      const legacyProvider = getLegacyProvider(props.__all, type);
      if (legacyProvider.canEagerConnect) {
        const namespaces = targetNamespaces.map(
          (targetNamespace) => targetNamespace[0].namespace
        );
        addWalletToStorage(type, namespaces);
      }

      return finalResult;
    },
    async disconnect(type) {
      const wallet = getHub().get(type);
      if (!wallet) {
        throw new Error(
          `You should add ${type} to provider first then call 'connect'.`
        );
      }

      wallet.getAll().forEach((namespace) => {
        return namespace.disconnect();
      });

      if (props.autoConnect) {
        removeWalletsFromStorage([type]);
      }
    },
    disconnectAll() {
      throw new Error('`disconnectAll` not implemented');
    },
    getSigners(type) {
      const provider = getLegacyProvider(props.__all, type);
      return provider.getSigners(provider.getInstance());
    },
    getWalletInfo(type) {
      const wallet = getHub().get(type);
      if (!wallet) {
        throw new Error(`You should add ${type} to provider first.`);
      }

      const info = wallet.info();
      if (!info) {
        throw new Error('Your provider should have required `info`.');
      }

      const provider = getLegacyProvider(props.__all, type);

      const installLink: Exclude<WalletInfo['installLink'], string> = {
        DEFAULT: '',
      };

      Object.keys(info.extensions).forEach((key) => {
        if (key === 'homepage') {
          installLink.DEFAULT = info.extensions[key]!;
        }
        const allowedKeys = ['firefox', 'chrome', 'brave', 'edge'];
        if (allowedKeys.includes(key)) {
          const keyUppercase = key.toUpperCase() as keyof Exclude<
            WalletInfo['installLink'],
            string
          >;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore-next-line
          installLink[keyUppercase] = info.extensions[key];
        }
      });

      return {
        name: info.name,
        img: info.icon,
        installLink: installLink,
        // We don't have this values anymore, fill them with some values that communicate this.
        color: 'red',
        supportedChains: provider.getWalletInfo(props.allBlockChains || [])
          .supportedChains,
        isContractWallet: false,
        mobileWallet: false,
        showOnMobile: false,
        properties: wallet.info()?.properties,
      };
    },
    providers() {
      const output: ReturnType<ProviderContext['providers']> = {};

      Array.from(getHub().getAll().keys()).forEach((id) => {
        try {
          const provider = getLegacyProvider(props.__all, id);
          output[id] = provider.getInstance();
        } catch (e) {
          console.warn(e);
        }
      });

      return output;
    },
    state(type) {
      // TODO: We can use `guessProviderStateSelector` here as well.
      const result = getHub().state();
      const provider = result[type];

      if (!provider) {
        throw new Error(
          `It seems your requested provider doesn't exist in hub. Provider Id: ${type}`
        );
      }

      const accounts = provider.namespaces
        .filter((namespace) => namespace.connected)
        .flatMap((namespace) =>
          namespace.accounts?.map(fromAccountIdToLegacyAddressFormat)
        )
        .filter((account): account is string => !!account);

      const coreState = {
        // TODO: When only one namespaces is selected, what will happens?
        connected: provider.connected,
        connecting: provider.connecting,
        installed: provider.installed,
        reachable: true,
        accounts: accounts,
        network: null,
      };

      return coreState;
    },
    suggestAndConnect(_type, _network): never {
      throw new Error('`suggestAndConnect` is not implemented');
    },
  };
}
