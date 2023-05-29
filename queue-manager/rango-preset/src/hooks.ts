import { useManager } from '@rango-dev/queue-manager-react';
import { useEffect, useState } from 'react';
import {
  checkWaitingForConnectWalletChange,
  checkWaitingForNetworkChange,
  retryOn,
} from './helpers';
import { migrated, migration } from './migration';
import { UseQueueManagerParams } from './types';

let isCalled = 0;

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
    (async () => {
      // Preventing react to be called twice on Strict Mode (development)
      if (isCalled) return;
      isCalled = 1;

      migration().finally(() => {
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
 * On initial load and also connect/disconnet we may need to update swap's notified message.
 * And also if a new wallet is connected we will retry the queue to see we can resume it or not.
 *
 */
function useQueueManager(params: UseQueueManagerParams): void {
  const { manager } = useManager();

  useEffect(() => {
    if (params.lastConnectedWallet) {
      checkWaitingForConnectWalletChange({
        evmChains: params.evmChains,
        wallet_network: params.lastConnectedWallet,
        manager,
        notifier: params.notifier,
      });
      retryOn(
        params.lastConnectedWallet,
        params.notifier,
        manager,
        params.canSwitchNetworkTo
      );
    }
  }, [params.lastConnectedWallet]);

  useEffect(() => {
    if (params.disconnectedWallet) {
      checkWaitingForNetworkChange(manager);

      /* 
        We need to reset the state value, so if a wallet disconnected twice (after reconnect),
        this effect will be run properly.
      */
      params.clearDisconnectedWallet();
    }
  }, [params.disconnectedWallet]);
}

export { useQueueManager, useMigration };
