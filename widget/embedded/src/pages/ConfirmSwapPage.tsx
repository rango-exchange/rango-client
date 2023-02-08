import React from 'react';
import { ConfirmSwap, SecondaryPage } from '@rangodev/ui';
import { useNavigate } from 'react-router-dom';
import { useBestRouteStore } from '../store/bestRoute';
import { navigationRoutes } from '../constants/navigationRoutes';

export function ConfirmSwapPage() {
  const navigate = useNavigate();

  const { bestRoute } = useBestRouteStore();

  return (
    <ConfirmSwap
      onConfirm={() => navigate(navigationRoutes.confirmWallets.split('/')[1])}
      onBack={() => navigate(-1)}
      bestRoute={bestRoute}
    />
  );
}
