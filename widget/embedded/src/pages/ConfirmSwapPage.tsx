import React from 'react';
import { ConfirmSwap, SecondaryPage } from '@rangodev/ui';
import { useNavigate } from 'react-router-dom';
import { useBestRouteStore } from '../store/bestRoute';

export function ConfirmSwapPage() {
  const navigate = useNavigate();

  const { bestRoute } = useBestRouteStore();

  return <ConfirmSwap onBack={() => navigate(-1)} swap={bestRoute!} />;
}
