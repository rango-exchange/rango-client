import React, { Fragment, PropsWithChildren } from 'react';
import { MemoryRouter, useInRouterContext } from 'react-router';
import { useQueueManager } from '@rango-dev/queue-manager-rango-preset';
import { WalletType } from '@rango-dev/wallets-shared';
import { isEvmBlockchain } from 'rango-types';
import { UpdateUrl } from './UpdateUrl';
import { useMetaStore } from '../store/meta';
import { useWallets } from '@rango-dev/wallets-core';

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
  const { blockchains } = useMetaStore.use.meta();
  const { canSwitchNetworkTo } = useWallets();

  const evmChains = blockchains.filter(isEvmBlockchain);

  useQueueManager({
    lastConnectedWallet: props.lastConnectedWallet,
    clearDisconnectedWallet: props.clearDisconnectedWallet,
    disconnectedWallet: props.disconnectedWallet,
    evmChains,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    notifier: () => {},
    canSwitchNetworkTo,
  });

  return (
    <>
      <Router>{children}</Router>
      {isRouterInContext && <UpdateUrl />}
    </>
  );
}
