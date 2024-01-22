import { i18n } from '@lingui/core';
import { cancelSwap } from '@rango-dev/queue-manager-rango-preset';
import { useManager } from '@rango-dev/queue-manager-react';
import { Alert } from '@rango-dev/ui';
import React from 'react';
import { useParams } from 'react-router-dom';

import { SwapDetails } from '../components/SwapDetails';
import { SwapDetailsPlaceholder } from '../components/SwapDetails/SwapDetails.Placeholder';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useAppStore } from '../store/AppStore';
import { getPendingSwaps } from '../utils/queue';

export function SwapDetailsPage() {
  const { manager, state } = useManager();
  const loading = !state.loadedFromPersistor;
  const pendingSwaps = getPendingSwaps(manager);
  const { requestId } = useParams<{ requestId: string }>();
  const navigateBack = useNavigateBack();
  const { fetchStatus: fetchMetaStatus } = useAppStore();

  if (!requestId) {
    return (
      <Alert
        containerStyles={{ margin: '20px' }}
        type="error"
        title={i18n.t(
          'The request ID is necessary to display the swap details.'
        )}
      />
    );
  }

  const showSkeleton = loading || fetchMetaStatus === 'loading';

  const selectedSwap = requestId
    ? pendingSwaps.find(({ swap }) => swap.requestId === requestId)
    : undefined;

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
        requestId={requestId}
        showSkeleton={showSkeleton}
      />
    );
  }

  return (
    <SwapDetails
      swap={swap}
      requestId={requestId}
      onCancel={onCancel}
      onDelete={onDelete}
    />
  );
}
