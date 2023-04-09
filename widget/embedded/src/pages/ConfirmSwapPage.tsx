import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmSwap } from '@rango-dev/ui';
import { useBestRouteStore } from '../store/bestRoute';
import { useSettingsStore } from '../store/settings';
import { ConfirmSwapExtraMessages } from '../components/warnings/ConfirmSwapExtraMessages';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { navigationRoutes } from '../constants/navigationRoutes';
import { ConfirmSwapErrors } from '../components/ConfirmSwapErrors';
import { ConfirmSwapWarnings } from '../components/ConfirmSwapWarnings';
import { useManager } from '@rango-dev/queue-manager-react';
import { useUiStore } from '../store/ui';
import { useConfirmSwap } from '../hooks/useConfirmSwap';
import { ConfirmSwapErrorTypes } from '../types';
import { useMetaStore } from '../store/meta';
import { getBestRouteWithCalculatedFees } from '../utils/routing';

export function ConfirmSwapPage() {
  const setSelectedSwap = useUiStore.use.setSelectedSwap();
  const { navigateBackFrom } = useNavigateBack();
  const { manager } = useManager();
  const navigate = useNavigate();

  const bestRoute = useBestRouteStore.use.bestRoute();
  const fetchingBestRoute = useBestRouteStore.use.loading();
  const { tokens } = useMetaStore.use.meta();

  const slippage = useSettingsStore.use.slippage();
  const customSlippage = useSettingsStore.use.customSlippage();
  const selectedSlippage = customSlippage || slippage;
  const { loading, errors, warnings, confirmSwap } = useConfirmSwap();

  const showHighSlippageWarning = !errors.find(
    (error) => error.type === ConfirmSwapErrorTypes.INSUFFICIENT_SLIPPAGE
  );

  return (
    <ConfirmSwap
      onConfirm={() => {
        confirmSwap?.().then((swap) => {
          if (swap) {
            manager?.create('swap', { swapDetails: swap });
            setSelectedSwap(swap.requestId);
            navigate(navigationRoutes.swaps + `/${swap.requestId}`, {
              replace: true,
            });
          }
        });
      }}
      onBack={navigateBackFrom.bind(null, navigationRoutes.confirmSwap)}
      bestRoute={getBestRouteWithCalculatedFees(bestRoute, tokens)}
      loading={loading}
      errors={ConfirmSwapErrors(errors)}
      warnings={ConfirmSwapWarnings(warnings)}
      extraMessages={
        showHighSlippageWarning && (
          <ConfirmSwapExtraMessages selectedSlippage={selectedSlippage} />
        )
      }
      confirmButtonTitle={
        warnings.length > 0 || errors.length > 0
          ? 'Proceed anyway!'
          : 'Confirm swap!'
      }
      confirmButtonDisabled={fetchingBestRoute}
    />
  );
}
