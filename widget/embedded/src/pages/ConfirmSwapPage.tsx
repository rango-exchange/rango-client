import React from 'react';
import { ConfirmSwap } from '@rangodev/ui';
import { useNavigate } from 'react-router-dom';
import { useBestRouteStore } from '../store/bestRoute';
import { emitter } from '../events/eventEmitter';
import { useConfirmSwap } from '../hooks/useConfirmSwap';

export function ConfirmSwapPage() {
  const navigate = useNavigate();

  const { bestRoute } = useBestRouteStore();

  const { data, error, loading, warning, bestRouteChanged, enoughBalance, feeStatus } =
    useConfirmSwap();

  console.log(data, error, loading, warning, bestRouteChanged, enoughBalance, feeStatus);

  return (
    <ConfirmSwap
      onConfirm={() => emitter.emit('confirm_swap')}
      onBack={() => navigate(-1)}
      bestRoute={bestRoute}
      loading={loading}
      error={error}
      warning={warning}
    />
  );
}
