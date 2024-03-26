import type { ProviderInterface } from '../v0/types';
import type {
  Hub,
  Provider,
  State,
  EventHandler as WalletEventHandler,
} from '@rango-dev/wallets-core';
import type { WalletInfo } from '@rango-dev/wallets-shared';

import { Events, guessNamespacesStateSelector } from '@rango-dev/wallets-core';

export function providerAdapter(hubProvider: Provider): ProviderInterface {
  return {
    config: {
      type: hubProvider.id,
    },
    connect: () => {
      throw new Error('Not implemented');
    },
    getInstance: () => {
      // TODO: Checking for is installed or not
      console.log(
        'provider id: {}, method: getInstance',
        hubProvider.id,
        new Error('Not implemented')
      );
    },
    getSigners: () => {
      throw new Error('Not implemented');
    },
    getWalletInfo: () => {
      const info = hubProvider.info();

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
      };
    },
    canEagerConnect: () => {
      throw new Error('Not implemented');
    },
    canSwitchNetworkTo: () => {
      throw new Error('Not implemented');
    },
    disconnect: () => {
      throw new Error('Not implemented');
    },
    subscribe: () => {
      throw new Error('Not implemented');
    },
    suggest: () => {
      throw new Error('Not implemented');
    },
    switchNetwork: () => {
      throw new Error('Not implemented');
    },
    // v1: hubProvider,
  };
}

export function checkHubStateAndTriggerEvents(
  hub: Hub,
  current: State,
  previous: State,
  onUpdateState: WalletEventHandler
) {
  const result = hub.state();
  console.log('[checkHubStateAndTriggerEvents]', result, { previous, current });

  hub.getAll().forEach((_provider, providerId) => {
    const currentProviderState = guessNamespacesStateSelector(
      current,
      providerId
    );
    const previousProviderState = guessNamespacesStateSelector(
      previous,
      providerId
    );

    const coreState = {
      connected: currentProviderState.connected,
      connecting: currentProviderState.connecting,
      installed: currentProviderState.installed,
      accounts: [],
      network: null,
      reachable: true,
    };

    const eventInfo = {
      supportedBlockchains: [],
      isContractWallet: false,
    };

    if (previousProviderState.installed !== currentProviderState.installed) {
      onUpdateState(
        providerId,
        Events.INSTALLED,
        currentProviderState.installed,
        coreState,
        eventInfo
      );
    }
    if (previousProviderState.connecting !== currentProviderState.connecting) {
      onUpdateState(
        providerId,
        Events.CONNECTING,
        currentProviderState.connecting,
        coreState,
        eventInfo
      );
    }
    if (previousProviderState.connected !== currentProviderState.connected) {
      onUpdateState(
        providerId,
        Events.CONNECTED,
        currentProviderState.connected,
        coreState,
        eventInfo
      );
    }
    // TODO: ACCOUNTS, NETWORK
  });
}
