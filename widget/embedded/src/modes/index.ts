import type { ModeContext, ModeStrategy } from './types';

import { useSwapMode } from '../hooks/useSwapMode';
import { useAppStore } from '../store/AppStore';
import { useQuoteStore } from '../store/quote';

import { stocksStrategy } from './stocks';
import { refuelStrategy, swapStrategy } from './swap';

export type {
  ModeContext,
  ModeStrategy,
  SwapItemType,
  TokenItemOverrides,
  TokenItemTag,
  TokenListSection,
} from './types';
export { getDefaultStocksToken, getInitialTradeDirection } from './stocks';

const strategies = {
  swap: swapStrategy,
  refuel: refuelStrategy,
  stocks: stocksStrategy,
};

/**
 * Returns the current mode strategy and the context its methods need.
 */
export function useModeStrategy(): {
  strategy: ModeStrategy;
  context: ModeContext;
} {
  const { swapMode } = useSwapMode();
  const store = useAppStore();
  const direction = useQuoteStore().use.tradeDirection();

  return {
    strategy: strategies[swapMode],
    context: { store, direction },
  };
}
