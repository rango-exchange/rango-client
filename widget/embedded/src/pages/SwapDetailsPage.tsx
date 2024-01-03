import { cancelSwap } from '@yeager-dev/queue-manager-rango-preset';
import { useManager } from '@yeager-dev/queue-manager-react';
import React from 'react';

import { SwapDetails } from '../components/SwapDetails';
import { SwapDetailsPlaceholder } from '../components/SwapDetails/SwapDetails.Placeholder';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useAppStore } from '../store/AppStore';
import { useUiStore } from '../store/ui';
import { getPendingSwaps } from '../utils/queue';

export function SwapDetailsPage() {
  const { manager, state } = useManager();
  const loading = !state.loadedFromPersistor;
  const pendingSwaps = getPendingSwaps(manager);
  const requestId = useUiStore.use.selectedSwapRequestId();
  const navigateBack = useNavigateBack();
  const { fetchStatus: fetchMetaStatus } = useAppStore();

  const showSkeleton = loading || fetchMetaStatus === 'loading';

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
        manager?.deleteQueue(selectedSwap.id);
        navigateBack();
      } catch (e) {
        console.log(e);
      }
    }
  };
  const swap = selectedSwap?.swap;

  if (!swap || showSkeleton) {
    return (
      <SwapDetailsPlaceholder
        requestId={requestId || ''}
        showSkeleton={showSkeleton}
      />
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
