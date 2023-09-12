import type { WidgetConfig } from '../types';

import { WalletState } from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-react';
import { type WalletType, WalletTypes } from '@rango-dev/wallets-shared';
import { useEffect, useState } from 'react';

import { configWalletsToWalletName } from '../utils/providers';
import {
  mapWalletTypesToWalletInfo,
  sortWalletsBasedOnConnectionState,
} from '../utils/wallets';

const ALL_SUPPORTED_WALLETS = Object.values(WalletTypes);

interface Params {
  supportedWallets: WidgetConfig['wallets'];
  multiWallets: boolean;
  config?: WidgetConfig;
  chain?: string;
  onBeforeConnect?: (walletType: string) => void;
  onConnect?: (walletType: string) => void;
}

/**
 * gets list of wallets with their information and an action for handling click callback fo UI
 * we need to share the logic of rendering list of wallets and handle clicking on them in different places
 * you can use this list whenever you need to show the list of wallets and needed callbacks
 */
export function useWalletList(params: Params) {
  const { config, chain, onBeforeConnect, onConnect } = params;
  const { state, disconnect, getWalletInfo, connect } = useWallets();

  /** It can be what has been set by widget config or as a fallback we use all the supported wallets by our library */
  const listAvailableWalletTypes =
    configWalletsToWalletName(config?.wallets, {
      walletConnectProjectId: config?.walletConnectProjectId,
    }) || ALL_SUPPORTED_WALLETS;

  const wallets = mapWalletTypesToWalletInfo(
    state,
    getWalletInfo,
    listAvailableWalletTypes,
    chain
  );

  const sortedWallets = sortWalletsBasedOnConnectionState(wallets);
  const [error, setError] = useState('');

  const handleClick = async (type: WalletType) => {
    const wallet = state(type);
    try {
      if (error) {
        setError('');
      }
      if (wallet.connected) {
        await disconnect(type);
      } else {
        const atLeastOneWalletIsConnected = !!wallets.find(
          (w) => w.state === WalletState.CONNECTED
        );
        if (!config?.multiWallets && atLeastOneWalletIsConnected) {
          return;
        }
        onBeforeConnect?.(type);
        await connect(type);
        onConnect?.(type);
      }
    } catch (e) {
      setError('Error: ' + (e as any)?.message);
    }
  };

  const disconnectConnectingWallets = () => {
    const connectingWallets =
      wallets?.filter((wallet) => wallet.state === WalletState.CONNECTING) ||
      [];
    for (const wallet of connectingWallets) {
      void disconnect(wallet.type);
    }
  };

  useEffect(() => {
    return () => {
      disconnectConnectingWallets();
    };
  }, []);

  return {
    list: sortedWallets,
    error,
    handleClick,
  };
}
