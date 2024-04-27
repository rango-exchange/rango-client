import type { GetWalletInstance } from './hooks';
import type { WalletProviders } from './types';
import type { UseV0Props } from './useLegacy';

import { useEffect, useRef } from 'react';

import { autoConnect } from './helpers';

export function useAutoConnect(
  props: Pick<UseV0Props, 'allBlockChains' | 'autoConnect'> & {
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
