import { useInRouterContext, useNavigate } from 'react-router-dom';
import { navigationRoutes } from '../constants/navigationRoutes';

export function useNavigateBack() {
  const isRouterInContext = useInRouterContext();
  const navigate = useNavigate();

  navigationRoutes;

  const navigateBackFrom = (currentRoute: string) => {
    if (currentRoute === navigationRoutes.swapDetails)
      return navigate('/' + navigationRoutes.swaps, { replace: true });

    if (
      !isRouterInContext ||
      (window.history.state && window.history.state.idx > 0)
    )
      navigate(-1);
    else {
      if (
        [
          navigationRoutes.fromChain,
          navigationRoutes.fromToken,
          navigationRoutes.toChain,
          navigationRoutes.toToken,
          navigationRoutes.settings,
          navigationRoutes.wallets,
          navigationRoutes.swaps,
          navigationRoutes.confirmSwap,
        ].includes(currentRoute)
      )
        navigate(navigationRoutes.home, { replace: true });
      else if (currentRoute === navigationRoutes.liquiditySources)
        navigate('/' + navigationRoutes.settings, { replace: true });
    }
  };

  return { navigateBackFrom };
}
