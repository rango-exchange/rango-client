import React from 'react';
import { ProviderProps, Provider } from '@rangodev/wallets-core';
import Adapter from './adapter';

function AdapterProvider({ children, ...props }: ProviderProps) {
  return (
    <Provider {...props}>
      <Adapter>{children}</Adapter>
    </Provider>
  );
}
export default AdapterProvider;
