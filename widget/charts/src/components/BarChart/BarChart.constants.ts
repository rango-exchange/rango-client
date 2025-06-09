import type { BottomAxisData } from './BarChart.types.js';

export const DEFAULT_MARGIN = { top: 40, right: 0, bottom: 0, left: 20 };

export const TOOLTIP_DELAY_MS = 100;
export const TOOLTIP_HIDE_DELAY_MS = 300;

export const DEFAULT_CHART_COLORS: string[] = [
  '#469BF5',
  '#29DABA',
  '#D629DA',
  '#4658F5',
  '#9DF546',
  '#F01DA8',
  '#FF8B66',
  '#44F1E6',
  '#29DA7A',
  '#F17606',
  '#8B62FF',
  '#F4C932',
];

export const bottomAxisData: {
  [key: string]: {
    [key: number]: BottomAxisData;
  };
} = {
  desktop: {
    7: { numBottomAxis: 7, startBottomAxis: 0, intervalBottomAxis: 1 },
    30: { numBottomAxis: 6, startBottomAxis: 4, intervalBottomAxis: 5 },
    90: { numBottomAxis: 8, startBottomAxis: 5, intervalBottomAxis: 10 },
  },
  mobile: {
    7: { numBottomAxis: 3, startBottomAxis: 1, intervalBottomAxis: 2 },
    30: { numBottomAxis: 3, startBottomAxis: 3, intervalBottomAxis: 10 },
    90: { numBottomAxis: 3, startBottomAxis: 10, intervalBottomAxis: 30 },
  },
};

export const MAX_BAR_BUCKETS = 10;
