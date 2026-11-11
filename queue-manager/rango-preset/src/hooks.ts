import type { LastConnectedWallet, UseQueueManagerParams } from './types';

import { useManager } from '@rango-dev/queue-manager-react';
import { useEffect, useState } from 'react';

import {
  checkWaitingForConnectWalletChange,
  checkWaitingForNetworkChange,
  retryOn,
} from './helpers';
import { migrated, migration } from './migration';

let isCalled = 0;

function getLastConnectedWalletHash(
  lastConnectedWallet: LastConnectedWallet | null
) {
  return `${lastConnectedWallet?.walletType}-${
    lastConnectedWallet?.network
  }-${lastConnectedWallet?.accounts?.toString()}`;
}

/**
 *
 * Runs a migration (old swaps from localstorage to queue manager's IndexedDB)
 * It will be run only once on page load.
 *
 */
function useMigration(): {
  status: boolean;
} {
  const isMigrated = migrated();
  const [status, setStatus] = useState<boolean>(isMigrated);

  useEffect(() => {
    void (async () => {
      // Preventing react to be called twice on Strict Mode (development)
      if (isCalled) {
        return;
      }
      isCalled = 1;

      void migration().finally(() => {
        setStatus(true);
      });
    })();
  }, []);

  return {
    status,
  };
}

/**
 *
 * On initial load and also connect/disconnect we may need to update swap's notified message.
 * And also if a new wallet is connected we will retry the queue to see we can resume it or not.
 *
 */
function useQueueManager(params: UseQueueManagerParams): void {
  const { manager } = useManager();
  const {
    isActive,
    lastConnectedWallet,
    disconnectedWallet,
    evmChains,
    canSwitchNetworkTo,
    clearDisconnectedWallet,
  } = params;

  // Only the active tab changes swaps; wallet changes are picked up once the tab becomes active.
  useEffect(() => {
    if (isActive && lastConnectedWallet) {
      checkWaitingForConnectWalletChange({
        evmChains,
        lastConnectedWallet,
        manager,
      });
      retryOn(lastConnectedWallet, manager, canSwitchNetworkTo);
    }
  }, [isActive, getLastConnectedWalletHash(lastConnectedWallet)]);

  useEffect(() => {
    if (isActive && disconnectedWallet) {
      checkWaitingForNetworkChange(manager);

      /*
       *We need to reset the state value, so if a wallet disconnected twice (after reconnect),
       *this effect will be run properly.
       */
      clearDisconnectedWallet();
    }
  }, [isActive, disconnectedWallet]);

  useEffect(() => {
    if (isActive) {
      checkWaitingForNetworkChange(manager);
    }
  }, [isActive]);
}

export { useQueueManager, useMigration };
