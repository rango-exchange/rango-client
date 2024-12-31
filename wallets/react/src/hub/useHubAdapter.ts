import type { AllProxiedNamespaces, ExtensionLink } from './types.js';
import type { Providers } from '../index.js';
import type { Provider } from '@rango-dev/wallets-core';
import type { LegacyNamespaceInputForConnect } from '@rango-dev/wallets-core/legacy';
import type { Namespace } from '@rango-dev/wallets-core/namespaces/common';
import type { VersionedProviders } from '@rango-dev/wallets-core/utils';

import { legacyIsNamespaceDiscoverMode } from '@rango-dev/wallets-core/legacy';
import { type WalletInfo } from '@rango-dev/wallets-shared';
import { useEffect, useRef, useState } from 'react';

import {
  type ConnectResult,
  HUB_LAST_CONNECTED_WALLETS,
  type ProviderContext,
  type ProviderProps,
} from '../legacy/mod.js';
import { useAutoConnect } from '../legacy/useAutoConnect.js';

import { autoConnect } from './autoConnect.js';
import { fromAccountIdToLegacyAddressFormat } from './helpers.js';
import {
  LastConnectedWalletsFromStorage,
  type NamespaceInput,
} from './lastConnectedWallets.js';
import { useHubRefs } from './useHubRefs.js';
import {
  checkHubStateAndTriggerEvents,
  discoverNamespace,
  getLegacyProvider,
  transformHubResultToLegacyResult,
  tryConvertNamespaceNetworkToChainInfo,
} from './utils.js';

export type UseAdapterParams = Omit<ProviderProps, 'providers'> & {
  providers: Provider[];
  /** This is only will be used to access some parts of the legacy provider that doesn't exists in Hub. */
  allVersionedProviders: VersionedProviders[];
};

export function useHubAdapter(params: UseAdapterParams): ProviderContext {
  const { getStore, getHub } = useHubRefs(params.providers);
  const [, rerender] = useState(0);
  // useEffect will run `subscribe` once, so we need a reference and mutate the value if it's changes.
  const dataRef = useRef({
    onUpdateState: params.onUpdateState,
    allVersionedProviders: params.allVersionedProviders,
    allBlockChains: params.allBlockChains,
  });

  useEffect(() => {
    dataRef.current = {
      onUpdateState: params.onUpdateState,
      allVersionedProviders: params.allVersionedProviders,
      allBlockChains: params.allBlockChains,
    };
  }, [params]);

  // Initialize instances
  useEffect(() => {
    const runOnInit = () => {
      getHub().init();

      rerender((currentRender) => currentRender + 1);
    };

    // Then will call init whenever page is ready.
    const initHubWhenPageIsReady = (event: Event) => {
      // Then will call init whenever page is ready.
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        runOnInit();
        document.removeEventListener(
          'readystatechange',
          initHubWhenPageIsReady
        );
      }
    };

    // Try to run, maybe it's ready.
    runOnInit();

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
          dataRef.current.allVersionedProviders,
          dataRef.current.allBlockChains
        );
      }
      rerender((currentRender) => currentRender + 1);
    });
  }, []);

  useAutoConnect({
    autoConnect: params.autoConnect,
    allBlockChains: params.allBlockChains,
    autoConnectHandler: () => {
      void autoConnect({
        getLegacyProvider: getLegacyProvider.bind(
          null,
          params.allVersionedProviders
        ),
        allBlockChains: params.allBlockChains,
        getHub,
      });
    },
  });

  const lastConnectedWalletsFromStorage = new LastConnectedWalletsFromStorage(
    HUB_LAST_CONNECTED_WALLETS
  );

  const api: ProviderContext = {
    canSwitchNetworkTo(type, network) {
      const provider = getLegacyProvider(params.allVersionedProviders, type);
      const switchTo = provider.canSwitchNetworkTo;

      if (!switchTo) {
        return false;
      }

      return switchTo({
        network,
        meta: params.allBlockChains || [],
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
        throw new Error(
          'Passing namespace to `connect` is required. you can pass DISCOVERY_MODE for legacy.'
        );
      }

      // Check `namespace` and look into hub to see how it can match given namespace to hub namespace.
      const targetNamespaces: [
        LegacyNamespaceInputForConnect,
        AllProxiedNamespaces
      ][] = [];
      namespaces.forEach((namespace) => {
        let targetNamespace: Namespace;
        if (legacyIsNamespaceDiscoverMode(namespace)) {
          targetNamespace = discoverNamespace(namespace.network);
        } else {
          targetNamespace = namespace.namespace;
        }

        const result = wallet.findByNamespace(targetNamespace);

        if (!result) {
          throw new Error(
            `We couldn't find any provider matched with your request namespace. (requested namespace: ${namespace.namespace})`
          );
        }

        targetNamespaces.push([namespace, result]);
      });

      // Keeping only namespaces that connected successfully, then we'll store them on storage for auto connect functionality.
      const successfulyConnectedNamespaces: NamespaceInput[] = [];

      // Try to run `connect` on matched namespaces
      const connectResultFromTargetNamespaces = targetNamespaces.map(
        async ([namespaceInput, namespace]) => {
          const network = tryConvertNamespaceNetworkToChainInfo(
            namespaceInput,
            params.allBlockChains || []
          );

          /*
           * `connect` can have different interfaces (e.g. Solana -> .connect(), EVM -> .connect("0x1") ),
           * our assumption here is all the `connect` hasn't chain or if they have, they will accept it in first argument.
           * By this assumption, always passing a chain should be problematic since it will be ignored if the namespace's `connect` hasn't chain.
           */
          const result = namespace.connect(network);
          return result
            .then<ConnectResult>(transformHubResultToLegacyResult)
            .then((res) => {
              successfulyConnectedNamespaces.push({
                namsepace: namespaceInput.namespace,
                network: namespaceInput.network,
              });
              return res;
            });
        }
      );

      // If Provider has support for auto connect, we will add the wallet to storage.
      const legacyProvider = getLegacyProvider(
        params.allVersionedProviders,
        type
      );

      if (legacyProvider.canEagerConnect) {
        void Promise.allSettled(connectResultFromTargetNamespaces).then(() => {
          if (successfulyConnectedNamespaces.length > 0) {
            lastConnectedWalletsFromStorage.addWallet(
              type,
              successfulyConnectedNamespaces
            );
          }
        });
      }

      const connectResultWithLegacyFormat = await Promise.all(
        connectResultFromTargetNamespaces
      );

      return connectResultWithLegacyFormat;
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

      if (params.autoConnect) {
        lastConnectedWalletsFromStorage.removeWallets([type]);
      }
    },
    disconnectAll() {
      throw new Error('`disconnectAll` not implemented');
    },
    async getSigners(type) {
      const provider = getLegacyProvider(params.allVersionedProviders, type);
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

      const provider = getLegacyProvider(params.allVersionedProviders, type);

      const installLink: Exclude<WalletInfo['installLink'], string> = {
        DEFAULT: '',
      };

      // `extensions` in legacy format was uppercase and also `DEFAULT` was used instead of `homepage`
      Object.keys(info.extensions).forEach((k) => {
        const key = k as ExtensionLink;

        if (info.extensions[key] === 'homepage') {
          installLink.DEFAULT = info.extensions[key] || '';
        }

        const allowedKeys: ExtensionLink[] = [
          'firefox',
          'chrome',
          'brave',
          'edge',
        ];
        if (allowedKeys.includes(key)) {
          const upperCasedKey = key.toUpperCase() as keyof Exclude<
            WalletInfo['installLink'],
            string
          >;
          installLink[upperCasedKey] = info.extensions[key] || '';
        }
      });

      return {
        name: info.name,
        img: info.icon,
        installLink: installLink,
        // We don't have this values anymore, fill them with some values that communicate this.
        color: 'red',
        supportedChains: provider.getWalletInfo(params.allBlockChains || [])
          .supportedChains,
        isContractWallet: false,
        mobileWallet: false,
        // if set to false here, it will not show the wallet in mobile in anyways. to be compatible with old behavior, undefined is more appropirate.
        showOnMobile: undefined,

        isHub: true,
        properties: wallet.info()?.properties,
      };
    },
    providers() {
      const output: Providers = {};

      Array.from(getHub().getAll().keys()).forEach((id) => {
        try {
          const provider = getLegacyProvider(params.allVersionedProviders, id);
          output[id] = provider.getInstance();
        } catch (e) {
          console.warn(e);
        }
      });

      return output;
    },
    state(type) {
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

  return api;
}
