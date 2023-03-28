import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useManager } from '@rango-dev/queue-manager-react';
import { SwapHistory } from '@rango-dev/ui';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { getPendingSwaps } from '../utils/queue';

export function SwapDetailsPage() {
  const { navigateBackFrom } = useNavigateBack();
  const location = useLocation();
  const { manager } = useManager();
  const requestIdRef = useRef<string>(null);

  useEffect(() => {
    if (location?.state?.requestId) {
      requestIdRef.current = location?.state?.requestId;
    }
  }, [location?.state?.requestId]);

  const pendingSwaps = getPendingSwaps(manager);

  const currentSwap = pendingSwaps.find(
    (pendingSwap) => pendingSwap.swap.requestId === requestIdRef.current
  );

  return (
    <SwapHistory
      onBack={navigateBackFrom.bind(null, navigationRoutes.swapDetails)}
      pendingSwap={currentSwap?.swap}
    />
  );
}
