import { createContext } from 'react';

type SwapModeContextType = 'swap' | 'refuel';

export const SwapModeContext = createContext<SwapModeContextType>('swap');
