import type { Hub, Versions } from '@rango-dev/wallets-core';
import type { BlockchainMeta } from 'rango-types/lib';

import { useEffect, useRef } from 'react';

import { autoConnect, shouldTryAutoConnect } from './autoConnect';
import { getLegacyProvider } from './utils';

export function useAutoConnect(props: {
  getHub: () => Hub;
  allProviders: Versions[];
  allBlockChains?: BlockchainMeta[];
  autoConnect?: boolean;
}) {
  const autoConnectInitiated = useRef(false);

  // Running auto connect on instances
  useEffect(() => {
    if (shouldTryAutoConnect(props) && !autoConnectInitiated.current) {
      autoConnectInitiated.current = true;
      void autoConnect({
        getLegacyProvider: getLegacyProvider.bind(null, props.allProviders),
        allBlockChains: props.allBlockChains,
        getHub: props.getHub,
      });
    }
  }, [props.autoConnect, props.allBlockChains]);
}
