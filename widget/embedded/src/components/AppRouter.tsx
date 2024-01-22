import type { WalletType } from '@rango-dev/wallets-shared';
import type { PropsWithChildren } from 'react';

import { useQueueManager } from '@rango-dev/queue-manager-rango-preset';
import { useWallets } from '@rango-dev/wallets-react';
import { isEvmBlockchain } from 'rango-types';
import React, { Fragment } from 'react';
import { MemoryRouter, useInRouterContext } from 'react-router';

import { useForceAutoConnect } from '../hooks/useForceAutoConnect';
import { useAppStore } from '../store/AppStore';

export function AppRouter({
  children,
  ...props
}: PropsWithChildren & {
  lastConnectedWallet: string;
  disconnectedWallet: WalletType | undefined;
  clearDisconnectedWallet: () => void;
}) {
  const isRouterInContext = useInRouterContext();
  const Router = isRouterInContext ? Fragment : MemoryRouter;
  const blockchains = useAppStore().blockchains();
  const { canSwitchNetworkTo } = useWallets();

  useForceAutoConnect();

  const evmChains = blockchains.filter(isEvmBlockchain);

  useQueueManager({
    lastConnectedWallet: props.lastConnectedWallet,
    clearDisconnectedWallet: props.clearDisconnectedWallet,
    disconnectedWallet: props.disconnectedWallet,
    evmChains,
    canSwitchNetworkTo,
  });

  return <Router>{children}</Router>;
}
