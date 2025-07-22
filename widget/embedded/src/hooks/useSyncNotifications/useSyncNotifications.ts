import { useManager } from '@arlert-dev/queue-manager-react';
import { useEffect } from 'react';

import { useNotificationStore } from '../../store/notification';
import { getPendingSwaps } from '../../utils/queue';

export function useSyncNotifications() {
  const { isSynced, syncNotifications } = useNotificationStore();
  const { manager, state } = useManager();

  useEffect(() => {
    const shouldSyncNotifications =
      useNotificationStore.persist.hasHydrated() &&
      state.loadedFromPersistor &&
      !isSynced;

    if (shouldSyncNotifications) {
      syncNotifications(getPendingSwaps(manager));
    }
  }, [
    useNotificationStore.persist.hasHydrated(),
    state.loadedFromPersistor,
    isSynced,
  ]);
}
