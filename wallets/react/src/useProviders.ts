import type {
  ExtendedWalletInfo,
  ProviderContext,
  ProviderProps,
  Providers,
} from './index.js';
import type { ConnectResult } from './legacy/mod.js';
import type { LegacyState } from '@rango-dev/wallets-core/legacy';
import type { SignerFactory } from 'rango-types';

import {
  findProviderByType,
  separateLegacyAndHubProviders,
  useHubAdapter,
} from './hub/mod.js';
import { useLegacyProviders } from './legacy/mod.js';

/*
 * We have two separate interface for our providers: legacy and hub.
 * This hook sits between this two interface by keeping old interface as main API and try to add Hub providers by using an adapter.
 * For gradual migrating and backward compatibility, we are supporting hub by an adapter besides of the old one.
 */
function useProviders(props: ProviderProps) {
  const { providers, ...restProps } = props;
  const [legacyProviders, hubProviders] =
    separateLegacyAndHubProviders(providers);

  const legacyApi = useLegacyProviders({
    ...restProps,
    providers: legacyProviders,
  });
  const hubApi = useHubAdapter({
    ...restProps,
    providers: hubProviders,
    allVersionedProviders: providers,
  });

  const api: ProviderContext = {
    canSwitchNetworkTo(type, network): boolean {
      if (findProviderByType(hubProviders, type)) {
        return hubApi.canSwitchNetworkTo(type, network);
      }
      return legacyApi.canSwitchNetworkTo(type, network);
    },
    async connect(type, namespaces): Promise<ConnectResult[]> {
      const hubProvider = findProviderByType(hubProviders, type);
      if (hubProvider) {
        return await hubApi.connect(type, namespaces);
      }

      return await legacyApi.connect(type, namespaces);
    },
    async disconnect(type, namespaces): Promise<void> {
      const hubProvider = findProviderByType(hubProviders, type);
      if (hubProvider) {
        return await hubApi.disconnect(type, namespaces);
      }

      return await legacyApi.disconnect(type);
    },
    async disconnectAll() {
      return await Promise.allSettled([
        hubApi.disconnectAll(),
        legacyApi.disconnectAll(),
      ]);
    },
    async getSigners(type): Promise<SignerFactory> {
      const hubProvider = findProviderByType(hubProviders, type);
      if (hubProvider) {
        return hubApi.getSigners(type);
      }
      return legacyApi.getSigners(type);
    },
    getWalletInfo(type): ExtendedWalletInfo {
      const hubProvider = findProviderByType(hubProviders, type);
      if (hubProvider) {
        return hubApi.getWalletInfo(type);
      }

      return legacyApi.getWalletInfo(type);
    },
    providers(): Providers {
      let output: Providers = {};
      if (hubProviders.length > 0) {
        output = { ...output, ...hubApi.providers() };
      }
      if (legacyProviders.length > 0) {
        output = { ...output, ...legacyApi.providers() };
      }

      return output;
    },
    state(type): LegacyState {
      const hubProvider = findProviderByType(hubProviders, type);

      if (hubProvider) {
        return hubApi.state(type);
      }

      return legacyApi.state(type);
    },
    async suggestAndConnect(type, network): Promise<ConnectResult> {
      const hubProvider = findProviderByType(hubProviders, type);

      if (hubProvider) {
        return hubApi.suggestAndConnect(type, network);
      }

      return await legacyApi.suggestAndConnect(type, network);
    },
  };

  return api;
}

export { useProviders };
