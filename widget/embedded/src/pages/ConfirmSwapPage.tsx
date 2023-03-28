import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmSwap } from '@rango-dev/ui';
import { useBestRouteStore } from '../store/bestRoute';
import { useSettingsStore } from '../store/settings';
import { ConfirmSwapExtraMessages } from '../components/warnings/ConfirmSwapExtraMessages';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { navigationRoutes } from '../constants/navigationRoutes';
import { confirmSwap, useConfirmSwapStore } from '../store/confirmSwap';
import { ConfirmSwapErrors } from '../components/ConfirmSwapErrors';
import { ConfirmSwapWarnings } from '../components/ConfirmSwapWarnings';
import { useManager } from '@rango-dev/queue-manager-react';

export function ConfirmSwapPage() {
  const { navigateBackFrom } = useNavigateBack();
  const { manager } = useManager();
  const navigate = useNavigate();

  const bestRoute = useBestRouteStore.use.bestRoute();

  const loading = useConfirmSwapStore.use.loading();
  const warnings = useConfirmSwapStore.use.warnings();
  const errors = useConfirmSwapStore.use.errors();

  console.log('loading:', loading, 'warnings:', warnings, 'errors:', errors);

  const slippage = useSettingsStore.use.slippage();
  const customSlippage = useSettingsStore.use.customSlippage();
  const selectedSlippage = customSlippage || slippage;

  return (
    <ConfirmSwap
      onConfirm={() => {
        confirmSwap().then((swap) => {
          if (swap) {
            manager?.create('swap', { swapDetails: swap });
            navigate(navigationRoutes.swapDetails, {
              state: { requestId: swap.requestId },
            });
          }
        });
      }}
      onBack={navigateBackFrom.bind(null, navigationRoutes.confirmSwap)}
      bestRoute={bestRoute}
      loading={loading}
      errors={ConfirmSwapErrors(errors)}
      warnings={ConfirmSwapWarnings(warnings)}
      extraMessages={
        <ConfirmSwapExtraMessages selectedSlippage={selectedSlippage} />
      }
      confirmButtonTitle={
        warnings.length > 0 || errors.length > 0
          ? 'Proceed anyway!'
          : 'Confirm swap!'
      }
      confirmButtonDisabled={errors.length > 0}
    />
  );
}
