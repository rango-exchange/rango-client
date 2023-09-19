import { useInRouterContext, useNavigate } from 'react-router-dom';

import { navigationRoutes } from '../constants/navigationRoutes';

export function useNavigateBack() {
  const isRouterInContext = useInRouterContext();
  const navigate = useNavigate();

  navigationRoutes;

  const navigateBackFrom = (currentRoute: string) => {
    if (currentRoute === navigationRoutes.swapDetails) {
      return navigate('/' + navigationRoutes.swaps, { replace: true });
    }

    if (
      !isRouterInContext ||
      (window.history.state && window.history.state.idx > 0)
    ) {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      navigate(-1);
    } else {
      if (
        [
          navigationRoutes.fromSwap,
          navigationRoutes.toSwap,
          navigationRoutes.settings,
          navigationRoutes.wallets,
          navigationRoutes.swaps,
          navigationRoutes.confirmSwap,
        ].includes(currentRoute)
      ) {
        navigate(navigationRoutes.home, { replace: true });
      } else if (currentRoute === navigationRoutes.fromBlockchain) {
        navigate('/' + navigationRoutes.fromSwap, { replace: true });
      } else if (currentRoute === navigationRoutes.toBlockchain) {
        navigate('/' + navigationRoutes.fromSwap, { replace: true });
      } else if (currentRoute === navigationRoutes.liquiditySources) {
        navigate('/' + navigationRoutes.settings, { replace: true });
      }
    }
  };

  return { navigateBackFrom };
}
