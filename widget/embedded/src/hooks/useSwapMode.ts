import { useContext } from 'react';

import { SwapModeContext } from '../context/swapModeContext';

export function useSwapMode() {
  const swapMode = useContext(SwapModeContext);

  return swapMode;
}
