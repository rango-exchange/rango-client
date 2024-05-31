import type { ProviderContext, ProviderProps } from './legacy/types';

import React from 'react';

import { findProviderByType, splitProviders } from './hub/helpers';
import { useAdapter } from './hub/useAdapter';
import { WalletContext } from './legacy/context';
import { useLegacy } from './legacy/useLegacy';

function Provider(props: ProviderProps) {
  const { providers, ...restProps } = props;
  const [legacyProviders, nextProviders] = splitProviders(providers, {
    isExperimentalEnabled: restProps.configs?.isExperimentalEnabled,
  });

  // For gradual migrating and backward compatibility, we are supporting new version by an adapter besides of the old one.
  const legacyApi = useLegacy({ ...restProps, providers: legacyProviders });
  const nextApi = useAdapter({
    ...restProps,
    providers: nextProviders,
    __all: providers,
  });

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const api: ProviderContext = {
    canSwitchNetworkTo(type, network) {
      if (findProviderByType(nextProviders, type)) {
        return nextApi.canSwitchNetworkTo(type, network);
      }
      return legacyApi.canSwitchNetworkTo(type, network);
    },
    async connect(type, network) {
      const nextProvider = findProviderByType(nextProviders, type);
      if (nextProvider) {
        return await nextApi.connect(type, network);
      }

      return await legacyApi.connect(type, network);
    },
    async disconnect(type) {
      const nextProvider = findProviderByType(nextProviders, type);
      if (nextProvider) {
        return await nextApi.disconnect(type);
      }

      return await legacyApi.disconnect(type);
    },
    async disconnectAll() {
      return await Promise.allSettled([
        nextApi.disconnectAll(),
        legacyApi.disconnectAll(),
      ]);
    },
    getSigners(type) {
      const nextProvider = findProviderByType(nextProviders, type);
      if (nextProvider) {
        return nextApi.getSigners(type);
      }
      return legacyApi.getSigners(type);
    },
    getWalletInfo(type) {
      const nextProvider = findProviderByType(nextProviders, type);
      if (nextProvider) {
        return nextApi.getWalletInfo(type);
      }

      return legacyApi.getWalletInfo(type);
    },
    providers() {
      let output: ReturnType<ProviderContext['providers']> = {};
      if (nextProviders.length > 0) {
        output = { ...output, ...nextApi.providers() };
      }
      if (legacyProviders.length > 0) {
        output = { ...output, ...legacyApi.providers() };
      }

      return output;
    },
    state(type) {
      const nextProvider = findProviderByType(nextProviders, type);

      if (nextProvider) {
        return nextApi.state(type);
      }

      return legacyApi.state(type);
    },
    async suggestAndConnect(type, network) {
      const nextProvider = findProviderByType(nextProviders, type);

      if (nextProvider) {
        throw new Error(
          "New version doesn't have support for this method yet."
        );
      }

      return await legacyApi.suggestAndConnect(type, network);
    },
  };

  return (
    <WalletContext.Provider value={api}>
      {props.children}
    </WalletContext.Provider>
  );
}

export default Provider;
