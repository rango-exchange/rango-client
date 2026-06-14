import { useManager } from '@rango-dev/queue-manager-react';
import { useEffect } from 'react';

import { useNotificationStore } from '../../store/notification';
import { UiEventTypes } from '../../types';
import { emitUiEvent } from '../../utils/events';
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
      const pendingSwaps = getPendingSwaps(manager);
      syncNotifications(pendingSwaps);

      pendingSwaps.forEach(({ swap }) => {
        const isInProgressMultiStep =
          swap.status === 'running' && swap.steps.length > 1;
        if (!isInProgressMultiStep) {
          return;
        }
        const currentStepIndex = swap.steps.findIndex(
          (step) => step.status !== 'success'
        );
        emitUiEvent({
          type: UiEventTypes.SWAP_RESUMED,
          payload: {
            routeId: swap.requestId,
            stepCount: swap.steps.length,
            stepNumber:
              currentStepIndex === -1
                ? swap.steps.length
                : currentStepIndex + 1,
          },
        });
      });
    }
  }, [
    useNotificationStore.persist.hasHydrated(),
    state.loadedFromPersistor,
    isSynced,
  ]);
}
