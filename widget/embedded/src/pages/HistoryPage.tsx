import { useManager } from '@rangodev/queue-manager-react';
import { History } from '@rangodev/ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { navigationRoutes } from '../constants/navigationRoutes';
import { getPendingSwaps } from '../rango/helpers';


export function HistoryPage() {
  const navigate = useNavigate();
  const { manager } = useManager();
  const pendingSwaps = getPendingSwaps(manager);

  return (
    <History
    list={pendingSwaps.map((pending) => pending.swap)}
      onSwapClick={() => navigate(navigationRoutes.swapDetails)}
      onBack={() => {
        navigate(-1);
      }}
    />
  );
}
