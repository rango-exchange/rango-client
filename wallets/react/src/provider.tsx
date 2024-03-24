import type { ProviderProps } from './v0/types';

import React from 'react';

import { WalletContext } from './v0/context';
import { useV0 } from './v0/useV0';
import { isV0Provider, isV1Provider } from './v1/helpers';
import { useV1 } from './v1/useV1';

function Provider(props: ProviderProps) {
  const { providers, ...restProps } = props;
  const v0Providers = providers.filter(isV0Provider);
  const v1Providers = providers.filter(isV1Provider);
  const v0Api = useV0({ ...restProps, providers: v0Providers });
  const v1Api = useV1({ ...restProps, providers: v1Providers });

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const api = {
    canSwitchNetworkTo(type: string, network: string) {
      return v0Api.canSwitchNetworkTo(type, network);
    },
    async connect(type: string, network: string | undefined) {
      if (v1Providers.find((provider) => provider.id === type)) {
        return v1Api.connect(type, network);
      }

      return await v0Api.connect(type, network);
    },
    async disconnect(type: string) {
      return await v0Api.disconnect(type);
    },
    async disconnectAll() {
      return await v0Api.disconnectAll();
    },
    getSigners(type: string) {
      return v0Api.getSigners(type);
    },
    getWalletInfo(type: string) {
      if (v1Providers.find((provider) => provider.id === type)) {
        return v1Api.getWalletInfo(type);
      }

      return v0Api.getWalletInfo(type);
    },
    providers() {
      return v0Api.providers();
    },
    state(type: string) {
      if (v1Providers.find((provider) => provider.id === type)) {
        return v1Api.state(type);
      }

      return v0Api.state(type);
    },
    async suggestAndConnect(type: string, network: string) {
      return await v0Api.suggestAndConnect(type, network);
    },
  };

  return (
    <WalletContext.Provider value={api}>
      {props.children}
    </WalletContext.Provider>
  );
}

export default Provider;
