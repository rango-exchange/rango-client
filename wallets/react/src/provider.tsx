import type { ProviderContext, ProviderProps } from './legacy/types';

import React from 'react';

import { WalletContext } from './legacy/context';
import { useLegacy } from './legacy/useLegacy';
import { findProviderByType, splitProviders } from './next/helpers';
import { useAdapter } from './next/useAdapter';

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
  const api = {
    canSwitchNetworkTo(type: string, network: string) {
      if (findProviderByType(nextProviders, type)) {
        throw new Error(
          "New version doesn't have support for this method yet."
        );
      }
      return legacyApi.canSwitchNetworkTo(type, network);
    },
    async connect(type: string, network: string | undefined) {
      if (nextProviders.find((provider) => provider.id === type)) {
        return await nextApi.connect(type, network);
      }

      return await legacyApi.connect(type, network);
    },
    async disconnect(type: string) {
      if (nextProviders.find((provider) => provider.id === type)) {
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
    getSigners(type: string) {
      if (nextProviders.find((provider) => provider.id === type)) {
        throw new Error(
          "New version doesn't have support for this method yet."
        );
      }
      return legacyApi.getSigners(type);
    },
    getWalletInfo(type: string) {
      if (nextProviders.find((provider) => provider.id === type)) {
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
    state(type: string) {
      if (nextProviders.find((provider) => provider.id === type)) {
        return nextApi.state(type);
      }

      return legacyApi.state(type);
    },
    async suggestAndConnect(type: string, network: string) {
      if (nextProviders.find((provider) => provider.id === type)) {
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
