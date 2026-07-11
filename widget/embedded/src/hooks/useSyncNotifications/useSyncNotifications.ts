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
        /*
         * The current step is the first one that hasn't succeeded yet. A
         * running swap should always have one; if not (all steps already
         * succeeded), the state is inconsistent/transient, so skip it rather
         * than report a misleading step.
         */
        const currentStepIndex = swap.steps.findIndex(
          (step) => step.status !== 'success'
        );
        if (currentStepIndex === -1) {
          return;
        }

        emitUiEvent({
          type: UiEventTypes.SWAP_RESUMED,
          payload: {
            routeId: swap.requestId,
            stepCount: swap.steps.length,
            stepNumber: currentStepIndex + 1,
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
