import { createContext, useContext } from 'react';

type SwapModeContextType = 'swap' | 'refuel';

export const SwapModeContext = createContext<SwapModeContextType>('swap');

export function useSwapMode() {
  const swapMode = useContext(SwapModeContext);

  return swapMode;
}
