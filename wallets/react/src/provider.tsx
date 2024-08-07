import type { ProviderProps } from './legacy/types.js';

import React from 'react';

import { WalletContext } from './legacy/context.js';
import { useLegacyProviders } from './legacy/useLegacyProviders.js';

function Provider(props: ProviderProps) {
  const legacyApi = useLegacyProviders(props);

  return (
    <WalletContext.Provider value={legacyApi}>
      {props.children}
    </WalletContext.Provider>
  );
}

export default Provider;
