import { cancelSwap } from '@rango-dev/queue-manager-rango-preset';
import { useManager } from '@rango-dev/queue-manager-react';
import React from 'react';

import { SwapDetails } from '../components/SwapDetails';
import { SwapDetailsPlaceholder } from '../components/SwapDetails/SwapDetails.Placeholder';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useUiStore } from '../store/ui';
import { getPendingSwaps } from '../utils/queue';

export function SwapDetailsPage() {
  const { manager, state } = useManager();
  const loading = !state.loadedFromPersistor;
  const pendingSwaps = getPendingSwaps(manager);
  const requestId = useUiStore.use.selectedSwapRequestId();
  const { navigateBackFrom } = useNavigateBack();

  const selectedSwap = pendingSwaps.find(
    ({ swap }) => swap.requestId === requestId
  );

  const onCancel = () => {
    if (selectedSwap?.id) {
      const swap = manager?.get(selectedSwap.id);
      if (swap) {
        cancelSwap(swap);
      }
    }
  };

  const onDelete = async () => {
    if (selectedSwap?.id) {
      try {
        await manager?.deleteQueue(selectedSwap.id);
        navigateBackFrom(navigationRoutes.swapDetails);
      } catch (e) {
        console.log(e);
      }
    }
  };
  const swap = selectedSwap?.swap;

  if (!swap) {
    return (
      <SwapDetailsPlaceholder requestId={requestId || ''} loading={loading} />
    );
  }

  return (
    <SwapDetails
      swap={swap}
      requestId={requestId || ''}
      onCancel={onCancel}
      onDelete={onDelete}
    />
  );
}
