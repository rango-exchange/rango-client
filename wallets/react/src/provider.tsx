import type { ProviderProps } from './types.js';

import React from 'react';

import { WalletContext } from './context.js';
import { useHubAdapter } from './hub/mod.js';

function Provider(props: ProviderProps) {
  const api = useHubAdapter(props);

  return (
    <WalletContext.Provider value={api}>
      {props.children}
    </WalletContext.Provider>
  );
}

export default Provider;
