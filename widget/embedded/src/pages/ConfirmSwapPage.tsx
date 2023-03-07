import React from 'react';
import { Alert, Button, ConfirmSwap } from '@rango-dev/ui';
import { useNavigate } from 'react-router-dom';
import { useBestRouteStore } from '../store/bestRoute';
import { useConfirmSwap } from '../hooks/useConfirmSwap';
import { useSettingsStore } from '../store/settings';
import { navigationRoutes } from '../constants/navigationRoutes';

const HIGH_SLIPPAGE = 1;

export function ConfirmSwapPage() {
  const navigate = useNavigate();

  const bestRoute = useBestRouteStore.use.bestRoute();

  const { minSlippage, loading, swap } = useConfirmSwap();

  const slippage = useSettingsStore.use.slippage();
  const customSlippage = useSettingsStore.use.customSlippage();
  const selectedSlippage = customSlippage || slippage;

  const ChangeSlippageButton = (
    <Button
      type="primary"
      variant="contained"
      size="small"
      onClick={navigate.bind(null, navigationRoutes.settings)}
    >
      Change Slippage
    </Button>
  );

  const warning =
    selectedSlippage >= HIGH_SLIPPAGE ? (
      <Alert type="warning">
        Your slippage is high <b>({selectedSlippage})</b>. You could update it
        in the swap settings if you want. {ChangeSlippageButton}
      </Alert>
    ) : null;

  const error = minSlippage ? (
    <Alert type="error">
      Your slippage should be {minSlippage} at least &nbsp;&nbsp;&nbsp;
      {ChangeSlippageButton}
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
    />
  );
}
