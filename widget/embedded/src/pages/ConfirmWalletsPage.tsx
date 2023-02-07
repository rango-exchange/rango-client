import React from 'react';
import { ConfirmWallets, SecondaryPage } from '@rangodev/ui';
import { useNavigate } from 'react-router-dom';
import { useBestRoute } from '../hooks/useBestRoute';
import { useBestRouteStore } from '../store/bestRoute';

export function ConfirmWalletsPage() {
  const navigate = useNavigate();

  const { bestRoute } = useBestRouteStore();
  return null;
  //   return <ConfirmWallets />;
}
