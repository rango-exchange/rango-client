import type {
  ProviderContext,
  ProviderProps,
  ProviderV1Interface,
} from '../v0/types';
import type { WalletInfo } from '@rango-dev/wallets-shared';

import { Hub } from '@rango-dev/wallets-core';
import { ChainId } from 'caip';
import { useEffect, useRef, useState } from 'react';

// import { checkHubStateAndTriggerEvents } from './adapter';

export type UseV1Props = Omit<ProviderProps, 'providers'> & {
  providers: ProviderV1Interface[];
};
export function useV1(props: UseV1Props): ProviderContext {
  const hub = useRef(new Hub());
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
  }, []);

  return {
    canSwitchNetworkTo(_type, _network) {
      throw new Error('not implemented');
    },
    connect(type, network) {
      const wallet = hub.current.get(type);
      if (!wallet) {
        throw new Error(
          `You should add ${type} to provider first then call 'connect'.`
        );
      }

      if (!network) {
        const timeout = 100;
        setTimeout(() => {
          rerender(currentRender + 1);
        }, timeout);
        return hub.current.runAll('connect');
      }

      const { namespace } = ChainId.parse(network);
      if (!namespace) {
        throw new Error('Please use a valid CAIP-2 as your network');
      }

      const result = wallet.findBy({
        namespace: namespace,
      });

      if (!result) {
        throw new Error(
          `We couldn't find any provider matched with your request chain`
        );
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-next-line
      return result.connect(network);
    },
    disconnect(_type) {
      throw new Error('not implemented');
    },
    disconnectAll() {
      throw new Error('not implemented');
    },
    getSigners(_type) {
      throw new Error('not implemented');
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

      const namespaces: string[] = [];
      wallet.getAll().forEach((blockchainProvider) => {
        namespaces.push(blockchainProvider.namespace);
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
        extras: {
          namespaces,
        },
      };
    },
    providers() {
      throw new Error('not implemented');
    },
    state(type) {
      const result = hub.current.state();
      const provider = result[type];
      console.log({ type, result });

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
      throw new Error('not implemented');
    },
  };
}
