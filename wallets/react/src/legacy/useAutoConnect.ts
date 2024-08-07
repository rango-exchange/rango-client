import type { GetWalletInstance } from './hooks.js';
import type { ProviderProps, WalletProviders } from './types.js';

import { useEffect, useRef } from 'react';

import { autoConnect } from './helpers.js';

export function useAutoConnect(
  props: Pick<ProviderProps, 'allBlockChains' | 'autoConnect'> & {
    wallets: WalletProviders;
    getWalletInstanceFromLegacy: GetWalletInstance;
  }
) {
  const autoConnectInitiated = useRef(false);

  // Running auto connect on instances
  useEffect(() => {
    const shouldTryAutoConnect =
      props.allBlockChains &&
      props.allBlockChains.length &&
      props.autoConnect &&
      !autoConnectInitiated.current;

    if (shouldTryAutoConnect) {
      autoConnectInitiated.current = true;
      void (async () => {
        await autoConnect(props.wallets, props.getWalletInstanceFromLegacy);
      })();
    }
  }, [props.autoConnect, props.allBlockChains]);
}
