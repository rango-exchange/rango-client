import type { LegacyProviderInterface } from '@rango-dev/wallets-core/legacy';
import type { ProviderProps } from '@rango-dev/wallets-react';

import { Provider } from '@rango-dev/wallets-react';
import React from 'react';

import Adapter from './adapter';

function AdapterProvider({ children, ...props }: ProviderProps) {
  const list = props.providers.map(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line
    (provider: LegacyProviderInterface) => provider.config.type
  );

  return (
    <Provider {...props}>
      <Adapter list={list}>{children}</Adapter>
    </Provider>
  );
}

export default AdapterProvider;
