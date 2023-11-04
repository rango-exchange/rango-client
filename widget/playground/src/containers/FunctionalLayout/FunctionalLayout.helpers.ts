import type { LiquidityType } from './FunctionalLayout.types';
import type { SwapperMeta } from 'rango-sdk';

export const filterByType = (type: LiquidityType, swapper: SwapperMeta) => {
  return (
    (type === 'DEX' && swapper.types.includes('DEX')) ||
    (type === 'BRIDGE' && !swapper.types.includes('DEX'))
  );
};

export const getLiquidityValue = (
  isAllSelected: boolean,
  excludedMode: boolean,
  isAllSelectedInCategory: boolean,
  selectedList?: string[]
) => {
  return isAllSelected
    ? excludedMode
      ? []
      : undefined
    : isAllSelectedInCategory
    ? undefined
    : selectedList;
};
