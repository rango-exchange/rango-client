import type { ProviderProps } from './legacy/types.js';

import React from 'react';

import { WalletContext } from './legacy/context.js';
import { useProviders } from './useProviders.js';

function Provider(props: ProviderProps) {
  const api = useProviders(props);

  return (
    <WalletContext.Provider value={api}>
      {props.children}
    </WalletContext.Provider>
  );
}

export default Provider;
