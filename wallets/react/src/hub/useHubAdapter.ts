import type { AllProxiedNamespaces } from './types.js';
import type { Providers } from '../index.js';
import type { Provider } from '@rango-dev/wallets-core';
import type {
  LegacyNamespaceInput,
  LegacyNamespace as Namespace,
} from '@rango-dev/wallets-core/legacy';
import type { VersionedProviders } from '@rango-dev/wallets-core/utils';
import type { WalletInfo } from '@rango-dev/wallets-shared';

import { isDiscoverMode, isEvmNamespace } from '@rango-dev/wallets-core/legacy';
import { useEffect, useRef, useState } from 'react';

import {
  type ConnectResult,
  HUB_LAST_CONNECTED_WALLETS,
  type ProviderContext,
  type ProviderProps,
} from '../legacy/mod.js';
import { useAutoConnect } from '../legacy/useAutoConnect.js';

import { autoConnect } from './autoConnect.js';
import {
  fromAccountIdToLegacyAddressFormat,
  isConnectResultEvm,
  isConnectResultSolana,
} from './helpers.js';
import { LastConnectedWalletsFromStorage } from './lastConnectedWallets.js';
import { useHubRefs } from './useHubRefs.js';
import {
  checkHubStateAndTriggerEvents,
  convertNamespaceNetworkToEvmChainId,
  discoverNamespace,
  getLegacyProvider,
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
        /*
         * TODO: I think this should be wallet.connect()
         * TODO: This isn't needed anymore since we can add a discovery namespace.
         * TODO: if the next line uncommented, make sure we are handling autoconnect persist as well.
         * return getHub().runAll('connect');
         */
        throw new Error(
          'Passing namespace to `connect` is required. you can pass DISCOVERY_MODE for legacy.'
        );
      }

      const targetNamespaces: [LegacyNamespaceInput, AllProxiedNamespaces][] =
        [];
      namespaces.forEach((namespace) => {
        let targetNamespace: Namespace;
        if (isDiscoverMode(namespace)) {
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

      const finalResult = await Promise.all(
        targetNamespaces.map(async ([info, namespace]) => {
          const evmChain = isEvmNamespace(info)
            ? convertNamespaceNetworkToEvmChainId(
                info,
                params.allBlockChains || []
              )
            : undefined;
          const chain = evmChain || info.network;

          // `connect` can have different interfaces (e.g. Solana -> .connect(), EVM -> .connect("0x1") ), our assumption here all the `connect` hasn't chain or if they have, they will accept it in first argument. By this assumption, always passing a chain should be problematic since it will be ignored if the namespace's `connect` hasn't chain.
          const result = namespace.connect(chain);
          return result.then<ConnectResult>((res) => {
            if (isConnectResultEvm(res)) {
              return {
                accounts: res.accounts,
                network: res.network,
                provider: undefined,
              };
            } else if (isConnectResultSolana(res)) {
              return {
                accounts: res,
                network: null,
                provider: undefined,
              };
            }

            return {
              accounts: [res],
              network: null,
              provider: undefined,
            };
          });
        })
      );

      const legacyProvider = getLegacyProvider(
        params.allVersionedProviders,
        type
      );
      if (legacyProvider.canEagerConnect) {
        const namespaces = targetNamespaces.map(
          (targetNamespace) => targetNamespace[0].namespace
        );
        lastConnectedWalletsFromStorage.addWallet(type, namespaces);
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
        supportedChains: provider.getWalletInfo(params.allBlockChains || [])
          .supportedChains,
        isContractWallet: false,
        mobileWallet: false,
        showOnMobile: false,
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

  return api;
}
