import type { ProviderContext, ProviderProps } from '../legacy/types';
import type { V1, Versions } from '@rango-dev/wallets-core';
import type { WalletInfo } from '@rango-dev/wallets-shared';

import { createStore, Hub } from '@rango-dev/wallets-core';
import { useEffect, useRef, useState } from 'react';

import { splitProviders } from './helpers';
import { checkHubStateAndTriggerEvents } from './utils';

export type UseAdapterProps = Omit<ProviderProps, 'providers'> & {
  providers: V1[];
  // This is only will be used to access some parts of the legacy provider that doesn't exists in Hub.
  __all: Versions[];
};
export function useAdapter(props: UseAdapterProps): ProviderContext {
  const store = useRef(createStore());
  const hub = useRef(
    new Hub({
      store: store.current,
    })
  );
  const [currentRender, rerender] = useState(0);

  // Initialize instances
  useEffect(() => {
    /*
     * First add providers to hub
     * This helps to `getWalletInfo` be usable, before initialize.
     */
    props.providers.forEach((provider) => {
      hub.current.add(provider.id, provider);
    });

    // Then will call init whenever page is ready.
    const initHubWhenPageIsReady = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        hub.current.init();

        /*
         * checkHubStateAndTriggerEvents(
         *   hub.current,
         *   makeEventHandler(dispatch, props.onUpdateState)
         * );
         */

        rerender(currentRender + 1);
      }
    };

    /*
     * Try again when the page has been completely loaded.
     * Some of wallets, take some time to be fully injected and loaded.
     */
    document.addEventListener('readystatechange', initHubWhenPageIsReady);

    store.current.subscribe((curr, prev) => {
      console.log('[store][subscribe]', prev, curr);
      if (props.onUpdateState) {
        checkHubStateAndTriggerEvents(
          hub.current,
          curr,
          prev,
          props.onUpdateState
        );
      }
      rerender(currentRender + 1);
    });
  }, []);

  return {
    canSwitchNetworkTo(type, network) {
      const [legacy] = splitProviders(props.__all);
      const provider = legacy.find((legacyProvider) => {
        legacyProvider.config.type === type;
      });
      if (!provider) {
        console.warn(
          `You have a provider that hasn't legacy provider. it causes some problems since we need some legacy functionality. Method: providers(), Provider Id: ${type}`
        );
        return false;
      }

      const switchTo = provider.canSwitchNetworkTo;

      if (!switchTo) {
        return false;
      }

      return switchTo({
        network,
        meta: props.allBlockChains || [],
        provider: provider.getInstance,
      });
    },
    async connect(type, namespaces) {
      const wallet = hub.current.get(type);
      if (!wallet) {
        throw new Error(
          `You should add ${type} to provider first then call 'connect'.`
        );
      }

      if (!namespaces) {
        // TODO: I think this should be wallet.connect()
        return hub.current.runAll('connect');
      }

      // TODO: CommonBlockchains somehow.
      const targetNamespaces: object[] = [];
      namespaces.forEach((namespace) => {
        const result = wallet.findBy({
          namespace: namespace,
        });

        if (!result) {
          throw new Error(
            `We couldn't find any provider matched with your request chain`
          );
        }

        targetNamespaces.push(result);
      });

      const finalResult = targetNamespaces.map((namespace) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore-next-line
        namespace.connect()
      );

      return finalResult;
    },
    async disconnect(type) {
      const wallet = hub.current.get(type);
      if (!wallet) {
        throw new Error(
          `You should add ${type} to provider first then call 'connect'.`
        );
      }

      wallet.getAll().forEach((namespace) => {
        return namespace.disconnect();
      });
    },
    disconnectAll() {
      throw new Error('`disconnectAll` not implemented');
    },
    getSigners(type) {
      const [legacy] = splitProviders(props.__all);
      const provider = legacy.find((legacyProvider) => {
        legacyProvider.config.type === type;
      });
      if (!provider) {
        console.warn(
          `You have a provider that hasn't legacy provider. it causes some problems since we need some legacy functionality. Method: providers(), Provider Id: ${type}`
        );
        throw new Error(
          `You need to have legacy implementation to use 'getSigners'. Provider Id: ${type}`
        );
      }

      return provider.getSigners(provider.getInstance);
    },
    getWalletInfo(type) {
      const wallet = hub.current.get(type);
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
        supportedChains: [],
        isContractWallet: false,
        mobileWallet: false,
        showOnMobile: false,
        properties: wallet.info()?.properties,
      };
    },
    providers() {
      const output: ReturnType<ProviderContext['providers']> = {};
      const [legacy] = splitProviders(props.__all);

      for (const id in hub.current.getAll().keys()) {
        const provider = legacy.find((legacyProvider) => {
          legacyProvider.config.type === id;
        });

        if (provider) {
          output[id] = provider.getInstance;
        } else {
          console.warn(
            `You have a provider that hasn't legacy provider. it causes some problems since we need some legacy functionality. Method: providers(), Provider Id: ${id}`
          );
        }
      }

      return output;
    },
    state(type) {
      // TODO: We can use `guessProviderStateSelector` here as well.
      const result = hub.current.state();
      const provider = result[type];

      const coreState = {
        connected: provider.connected,
        connecting: provider.connecting,
        installed: provider.installed,
        reachable: true,
        // TODO: use provider.blockchains
        accounts: [],
        network: null,
      };

      return coreState;
    },
    suggestAndConnect(_type, _network): never {
      throw new Error('`suggestAndConnect` is not implemented');
    },
  };
}
