import { History } from '@rango-dev/ui';
import { useManager } from '@rango-dev/queue-manager-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { getPendingSwaps } from '../utils/queue';

export function HistoryPage() {
  const navigate = useNavigate();
  const { navigateBackFrom } = useNavigateBack();
  const { manager } = useManager();
  const pendingSwaps = getPendingSwaps(manager);

  return (
    <History
      list={pendingSwaps.map((pending) => pending.swap)}
      onSwapClick={(requestId) =>
        navigate(navigationRoutes.swapDetails, {
          state: { requestId },
        })
      }
      onBack={navigateBackFrom.bind(null, navigationRoutes.history)}
    />
  );
}
