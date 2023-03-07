import React from 'react';
import { ConfirmSwap } from '@rango-dev/ui';
import { useNavigate } from 'react-router-dom';
import { useBestRouteStore } from '../store/bestRoute';
import { useConfirmSwap } from '../hooks/useConfirmSwap';
import { useSettingsStore } from '../store/settings';
import { ConfirmSwapExtraMessages } from '../components/warnings/ConfirmSwapExtraMessages';

export function ConfirmSwapPage() {
  const navigate = useNavigate();

  const bestRoute = useBestRouteStore.use.bestRoute();

  const { loading, swap, errors, warnings } = useConfirmSwap();

  const slippage = useSettingsStore.use.slippage();
  const customSlippage = useSettingsStore.use.customSlippage();
  const selectedSlippage = customSlippage || slippage;

  return (
    <ConfirmSwap
      onConfirm={swap?.bind(null)}
      onBack={navigate.bind(null, -1)}
      bestRoute={bestRoute}
      loading={loading}
      errors={errors}
      warnings={warnings}
      extraMessages={
        <ConfirmSwapExtraMessages selectedSlippage={selectedSlippage} />
      }
      confirmButtonTitle={
        warnings.length > 0 ? 'Proceed anyway!' : 'Confirm swap!'
      }
      confirmButtonDisabled={errors.length > 0}
    />
  );
}
