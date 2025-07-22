import type { LastConnectedWallet, UseQueueManagerParams } from './types';

import { useManager } from '@arlert-dev/queue-manager-react';
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
    lastConnectedWallet,
    disconnectedWallet,
    evmChains,
    canSwitchNetworkTo,
    clearDisconnectedWallet,
  } = params;

  useEffect(() => {
    if (lastConnectedWallet) {
      checkWaitingForConnectWalletChange({
        evmChains,
        lastConnectedWallet,
        manager,
      });
      retryOn(lastConnectedWallet, manager, canSwitchNetworkTo);
    }
  }, [getLastConnectedWalletHash(lastConnectedWallet)]);

  useEffect(() => {
    if (disconnectedWallet) {
      checkWaitingForNetworkChange(manager);

      /*
       *We need to reset the state value, so if a wallet disconnected twice (after reconnect),
       *this effect will be run properly.
       */
      clearDisconnectedWallet();
    }
  }, [disconnectedWallet]);
}

export { useQueueManager, useMigration };
