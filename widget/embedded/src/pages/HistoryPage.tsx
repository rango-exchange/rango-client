import { History } from '@rango-dev/ui';
import { useManager } from '@rango-dev/queue-manager-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { getPendingSwaps } from '../utils/queue';
import { useUiStore } from '../store/ui';
import { groupSwapsByDate } from '../utils/date';

export function HistoryPage() {
  const setSelectedSwap = useUiStore.use.setSelectedSwap();
  const navigate = useNavigate();
  const { navigateBackFrom } = useNavigateBack();
  const { manager, state } = useManager();
  const pendingSwaps = getPendingSwaps(manager).map(({ swap }) => swap);

  const loading = !state.loadedFromPersistor;

  return (
    <History
      list={pendingSwaps}
      groupBy={groupSwapsByDate}
      loading={loading}
      onSwapClick={(requestId) => {
        setSelectedSwap(requestId);
        navigate(`${requestId}`, { replace: true });
      }}
      onBack={navigateBackFrom.bind(null, navigationRoutes.swaps)}
    />
  );
}
