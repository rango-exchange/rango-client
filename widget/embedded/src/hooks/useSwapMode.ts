import type { AppStoreState } from '../store/slices/types';

import { createContext, useContext } from 'react';

import { AppStoreContext } from '../store/AppStore';

// Modes the host app can choose through `SwapModeContext`.
type PublicSwapMode = 'swap' | 'refuel';

/**
 * Modes the widget works in.
 * `stocks` is not exposed; it is enabled by `__UNSTABLE_OR_INTERNAL__.stocks` in the config.
 */
export type SwapMode = PublicSwapMode | 'stocks';

type SwapModeContextType = {
  swapMode: PublicSwapMode;
  isMultiMode: boolean;
};

export const SwapModeContext = createContext<SwapModeContextType>({
  swapMode: 'swap',
  isMultiMode: false,
});

const hasStocksConfig = (state: AppStoreState) =>
  !!state.config.__UNSTABLE_OR_INTERNAL__?.stocks;

export function useSwapMode(): {
  swapMode: SwapMode;
  isMultiMode: boolean;
} {
  const { swapMode, isMultiMode } = useContext(SwapModeContext);
  const appStore = useContext(AppStoreContext);

  if (!appStore) {
    throw new Error('Missing AppStoreContext.Provider in the tree');
  }
  const isStocksEnabled = appStore(hasStocksConfig);

  return {
    swapMode: swapMode === 'swap' && isStocksEnabled ? 'stocks' : swapMode,
    isMultiMode,
  };
}
