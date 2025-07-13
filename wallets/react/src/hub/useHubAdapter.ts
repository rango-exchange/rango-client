import type { AllProxiedNamespaces, ExtensionLink } from './types.js';
import type { ProviderContext, Providers } from '../index.js';
import type { Provider } from '@rango-dev/wallets-core';
import type { LegacyNamespaceInputForConnect } from '@rango-dev/wallets-core/legacy';
import type { VersionedProviders } from '@rango-dev/wallets-core/utils';

import { utils } from '@rango-dev/wallets-core/namespaces/evm';
import { type WalletInfo } from '@rango-dev/wallets-shared';
import { useEffect, useRef, useState } from 'react';
import { Ok, Result } from 'ts-results';

import {
  type ConnectResult,
  HUB_LAST_CONNECTED_WALLETS,
  type ProviderProps,
} from '../legacy/mod.js';
import { useAutoConnect } from '../legacy/useAutoConnect.js';

import { autoConnect } from './autoConnect.js';
import { createQueue, fromAccountIdToLegacyAddressFormat } from './helpers.js';
import { LastConnectedWalletsFromStorage } from './lastConnectedWallets.js';
import { useHubRefs } from './useHubRefs.js';
import {
  getLegacyProvider,
  getSupportedChainsFromProvider,
  mapHubEventsToLegacy,
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

  const queueTask = createQueue({
    onError: (error, actions) => {
      if (utils.isUserRejectionError(error)) {
        actions.removeCurrentKeyFromQueue();
      }
    },
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

    getStore()
      .subscribe((event) => {
        if (dataRef.current.onUpdateState) {
          try {
            mapHubEventsToLegacy(
              getHub(),
              event,
              dataRef.current.onUpdateState,
              dataRef.current.allBlockChains
            );
          } catch (e) {
            console.error(e);
          }
        }
        rerender((currentRender) => currentRender + 1);
      })
      .flushEvents();
  }, []);

  useAutoConnect({
    autoConnect: params.autoConnect,
    allBlockChains: params.allBlockChains,
    autoConnectHandler: () => {
      void autoConnect({
        allBlockChains: params.allBlockChains,
        getHub,
        wallets: params.configs?.wallets,
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
        throw new Error('Passing namespace to `connect` is required.');
      }

      // Check `namespace` and look into hub to see how it can match given namespace to hub namespace.
      const targetNamespaces: [
        LegacyNamespaceInputForConnect,
        AllProxiedNamespaces
      ][] = [];
      namespaces.forEach((namespace) => {
        const targetNamespace = namespace.namespace;

        const result = wallet.findByNamespace(targetNamespace);

        if (!result) {
          throw new Error(
            `We couldn't find any provider matched with your request namespace. (requested namespace: ${namespace.namespace})`
          );
        }

        targetNamespaces.push([namespace, result]);
      });

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
          const connectNamespaceProcess = async () =>
            namespace
              .connect(network)
              .then<ConnectResult>(transformHubResultToLegacyResult)
              .then((connectResult) => {
                return {
                  response: connectResult,
                  input: {
                    namespace: namespaceInput.namespace,
                    network: namespaceInput.network,
                    supportsEagerConnect: 'canEagerConnect' in namespace,
                  },
                };
              });
          return queueTask(connectNamespaceProcess, type);
        }
      );

      /*
       * We need to connect to namespace one after another, sending multiple requests at the same time may be failed.
       * e.g. when wallet popup opens and asking for the password from the user, it should be resolved first, then other request will be resolved.
       */
      const connectResultWithLegacyFormat = await Promise.all(
        connectResultFromTargetNamespaces
      );

      // Keeping only namespaces that connected successfully and support eager connect, then we'll store them on storage for auto connect functionality.
      const successfullyConnectedSupportingEagerConnectNamespaces =
        connectResultWithLegacyFormat
          .filter(<T, E>(result: Result<T, E>): result is Ok<T> => result.ok)
          .filter((result) => result.val.input.supportsEagerConnect)
          .map((result) => ({
            namespace: result.val.input.namespace,
            network: result.val.input.network,
          }));

      if (successfullyConnectedSupportingEagerConnectNamespaces.length > 0) {
        lastConnectedWalletsFromStorage.addWallet(
          type,
          successfullyConnectedSupportingEagerConnectNamespaces
        );
      }

      // Getting rid of `input` from Result
      const connectResults = connectResultWithLegacyFormat.map((result) =>
        result.andThen((okResult) => new Ok(okResult.response))
      );

      const allResult = Result.all(...connectResults);
      if (allResult.err) {
        throw allResult.val;
      }

      return allResult.unwrap();
    },
    async disconnect(type, namespaces) {
      const wallet = getHub().get(type);
      if (!wallet) {
        throw new Error(
          `You should add ${type} to provider first then call 'disconnect'.`
        );
      }

      wallet.getAll().forEach((namespace) => {
        const namespaceShouldBeDisconnected =
          !namespaces || namespaces.includes(namespace.namespaceId);
        const namespaceIsConnected = namespace.state()[0]().connected;
        if (namespaceShouldBeDisconnected && namespaceIsConnected) {
          return namespace.disconnect();
        }
      });

      if (params.autoConnect) {
        if (namespaces) {
          lastConnectedWalletsFromStorage.removeNamespacesFromWallet(
            type,
            namespaces
          );
        } else {
          lastConnectedWalletsFromStorage.removeWallets([type]);
        }
      }
    },
    async disconnectAll() {
      const disconnectPromises: Promise<void>[] = Array.from(
        getHub().getAll().values()
      ).map(async (provider) => this.disconnect(provider.id));

      return await Promise.allSettled(disconnectPromises);
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

      const installLink: Exclude<WalletInfo['installLink'], string> = {
        DEFAULT: '',
      };

      const { metadata, deepLink } = info;
      const { extensions } = metadata;
      // `extensions` in legacy format was uppercase and also `DEFAULT` was used instead of `homepage`
      Object.keys(extensions).forEach((k) => {
        const key = k as ExtensionLink;

        if (key === 'homepage') {
          installLink.DEFAULT = extensions[key] || '';
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
          installLink[upperCasedKey] = extensions[key] || '';
        }
      });

      const providerProperties = info.properties;

      const namespacesProperty = providerProperties?.find(
        (property) => property.name === 'namespaces'
      );
      const derivationPathProperty = providerProperties?.find(
        (property) => property.name === 'derivationPath'
      );
      const detailsProperty = providerProperties?.find(
        (property) => property.name === 'details'
      );

      return {
        name: metadata.name,
        img: metadata.icon,
        installLink: installLink,
        // We don't have this values anymore, fill them with some values that communicate this.
        color: 'red',
        supportedChains: getSupportedChainsFromProvider(
          wallet,
          dataRef.current.allBlockChains
        ),
        isContractWallet: detailsProperty?.value?.isContractWallet,
        mobileWallet: detailsProperty?.value?.mobileWallet,
        // if set to false here, it will not show the wallet in mobile in anyways. to be compatible with old behavior, undefined is more appropirate.
        showOnMobile: detailsProperty?.value?.showOnMobile,
        needsNamespace: namespacesProperty?.value,
        needsDerivationPath: derivationPathProperty?.value,
        generateDeepLink: deepLink,
        isHub: true,
        properties: metadata.properties,
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
      const hubState = getHub().state();
      const wallet = getHub().get(type);
      const walletState = hubState[type];

      if (!walletState || !wallet) {
        throw new Error(
          `It seems your requested provider doesn't exist in hub. Provider Id: ${type}`
        );
      }

      const accounts = walletState.namespaces
        .filter((namespace) => namespace.connected)
        .flatMap((namespace) =>
          namespace.accounts?.map(fromAccountIdToLegacyAddressFormat)
        )
        .filter((account): account is string => !!account);

      const namespacesState = new Map(
        Array.from(wallet.getAll(), ([_, value]) => [
          value.namespaceId,
          value.state()[0](),
        ])
      );

      const coreState = {
        connected: walletState.connected,
        connecting: walletState.connecting,
        installed: walletState.installed,
        reachable: true,
        accounts: accounts,
        network: null,
        namespaces: namespacesState,
      };
      return coreState;
    },
    suggestAndConnect(_type, _network): never {
      throw new Error('`suggestAndConnect` is not implemented');
    },
  };

  return api;
}
