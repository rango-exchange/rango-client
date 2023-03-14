import { SwapHistory } from '@rango-dev/ui';
import React from 'react';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { pendingSwap } from '../mockData/pendingSwap';

export function SwapDetailsPage() {
  const { navigateBackFrom } = useNavigateBack();
  return (
    <SwapHistory
      onBack={navigateBackFrom.bind(null, navigationRoutes.swapDetails)}
      pendingSwap={pendingSwap}
    />
  );
}
