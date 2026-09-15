import type { ProviderProps } from './types.js';

import React from 'react';

import { WalletContext } from './context.js';
import { useHubAdapter } from './hub/mod.js';
import { getHubProviders } from './hub/utils.js';

function Provider(props: ProviderProps) {
  const api = useHubAdapter({
    ...props,
    providers: getHubProviders(props.providers),
  });

  return (
    <WalletContext.Provider value={api}>
      {props.children}
    </WalletContext.Provider>
  );
}

export default Provider;
