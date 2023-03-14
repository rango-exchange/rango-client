import React from 'react';
import { Alert, Button, ConfirmSwap, styled, Typography } from '@rango-dev/ui';
import { useNavigate } from 'react-router-dom';
import { useBestRouteStore } from '../store/bestRoute';
import { useConfirmSwap } from '../hooks/useConfirmSwap';
import { useSettingsStore } from '../store/settings';
import { navigationRoutes } from '../constants/navigationRoutes';
import { ChangeSlippageButton } from '../components/ChangeSlippageButton';

const HIGH_SLIPPAGE = 1;

export function ConfirmSwapPage() {
  const navigate = useNavigate();

  const bestRoute = useBestRouteStore.use.bestRoute();

  const { loading, swap, error, warning } = useConfirmSwap();

  const slippage = useSettingsStore.use.slippage();
  const customSlippage = useSettingsStore.use.customSlippage();
  const selectedSlippage = customSlippage || slippage;

  const extraMessage =
    selectedSlippage >= HIGH_SLIPPAGE ? (
      <Alert type="warning">
        <Typography variant="body2">
          Your slippage is high <b>({selectedSlippage})</b>. You could update it
          in the swap settings if you want.
          <ChangeSlippageButton />
        </Typography>
      </Alert>
    ) : null;

  return (
    <ConfirmSwap
      onConfirm={swap.bind(null)}
      onBack={navigate.bind(null, -1)}
      bestRoute={bestRoute}
      loading={loading}
      error={error}
      warning={warning}
      extraMessages={extraMessage}
    />
  );
}
