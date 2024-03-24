// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// An adapter to use wallet v1 interface.

import type { ProviderInterface } from '../v0/types';
import type {
  Provider,
  EventHandler as WalletEventHandler,
} from '@rango-dev/wallets-core';
import type { WalletInfo } from '@rango-dev/wallets-shared';

import { hubProviders } from '@rango-dev/provider-all';
import { Events, Hub } from '@rango-dev/wallets-core';

/*
 * rename: installLink to extensions: default -> homepage, lowercase, removed string mode.
 * deprecated: supportedChains, showOnMobile, isContractWallet, mobileWallet, color
 */

// maybe remvove
export class HubAdapter {
  private hub: Hub;

  constructor() {
    this.hub = new Hub();
    const envs = {};
    hubProviders(envs).forEach((provider) => {
      this.hub.add(provider.id, provider);
    });
  }

  getWalletInfo(type: string): WalletInfo | undefined {
    const wallet = this.hub.get(type);
    if (wallet) {
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
      };
    }
    return;
  }
}

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
  onUpdateState: WalletEventHandler
) {
  const result = hub.state();
  console.log(result);

  const providersId = Object.keys(result);
  providersId.forEach((id) => {
    const provider = result[id];
    const coreState = {
      connected: provider.connected,
      connecting: provider.connecting,
      installed: provider.installed,
      accounts: [],
      network: null,
      reachable: true,
    };
    const eventInfo = {
      supportedBlockchains: [],
      isContractWallet: false,
    };
    onUpdateState(
      id,
      Events.INSTALLED,
      provider.installed,
      coreState,
      eventInfo
    );
  });
}
