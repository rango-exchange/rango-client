import React from 'react';
import { ProviderProps, Provider } from '@rango-dev/wallets-core';
import Adapter from './adapter';
import { WalletProvider } from '@rango-dev/wallets-core';

function AdapterProvider({ children, ...props }: ProviderProps) {
  const list = props.providers.map(
    (provider: WalletProvider) => provider.config.type
  );

  return (
    <Provider {...props}>
      <Adapter list={list}>{children}</Adapter>
    </Provider>
  );
}
export default AdapterProvider;
