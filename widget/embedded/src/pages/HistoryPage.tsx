import { History } from '@rango-dev/ui';
import { useManager } from '@rango-dev/queue-manager-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { getPendingSwaps } from '../utils/queue';
import { useUiStore } from '../store/ui';

export function HistoryPage() {
  const setSelectedSwap = useUiStore.use.setSelectedSwap();
  const navigate = useNavigate();
  const { navigateBackFrom } = useNavigateBack();
  const { manager } = useManager();
  const pendingSwaps = getPendingSwaps(manager).map(({ swap }) => swap);

  return (
    <History
      //todo: move PendingSwap type to rango-types
      //@ts-ignore
      list={pendingSwaps}
      onSwapClick={(requestId) => {
        setSelectedSwap(requestId);
        navigate(navigationRoutes.swaps + `/${requestId}`);
      }}
      onBack={navigateBackFrom.bind(null, navigationRoutes.swaps)}
    />
  );
}
