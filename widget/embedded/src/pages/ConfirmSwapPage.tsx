import React from 'react';
import { ConfirmSwap } from '@rangodev/ui';
import { useNavigate } from 'react-router-dom';
import { useBestRouteStore } from '../store/bestRoute';
import { useConfirmSwap } from '../hooks/useConfirmSwap';

export function ConfirmSwapPage() {
  const navigate = useNavigate();

  const bestRoute = useBestRouteStore.use.bestRoute();

  const { error, loading, warning, swap } = useConfirmSwap();

  return (
    <ConfirmSwap
      onConfirm={swap.bind(null)}
      onBack={navigate.bind(null, -1)}
      bestRoute={bestRoute}
      loading={loading}
      error={error}
      warning={warning}
    />
  );
}
