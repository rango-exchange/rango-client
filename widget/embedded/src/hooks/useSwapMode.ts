import { createContext, useContext } from 'react';

type SwapModeContextType = {
  swapMode: 'swap' | 'refuel';
  isMultiMode: boolean;
};

export const SwapModeContext = createContext<SwapModeContextType>({
  swapMode: 'swap',
  isMultiMode: false,
});

export function useSwapMode(): {
  swapMode: 'swap' | 'refuel';
  isMultiMode: boolean;
} {
  const { swapMode, isMultiMode } = useContext(SwapModeContext);

  return { swapMode: swapMode, isMultiMode: isMultiMode };
}
