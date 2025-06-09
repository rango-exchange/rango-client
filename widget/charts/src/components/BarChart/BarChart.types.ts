import type { SeriesPoint } from '@visx/shape/lib/types/barStack.js';

export interface BarChartPropTypes {
  data: BarStackDataType[];
  width: number;
  height: number;
  colorBucketMap: ColorBucketMapType;
  buckets: string[];
  margin?: { top: number; right: number; bottom: number; left: number };
  getLabel?: (value: string) => string;
  isDarkTheme?: boolean;
}

export type BarStackDataType = {
  [key: string]: string;
};

export type ColorBucketMapType = Map<string, string>;

export type TooltipDataType = {
  bar: {
    bar: SeriesPoint<BarStackDataType>;
    key: string;
    index: number;
    height: number;
    width: number;
    x: number;
    y: number;
    color: string;
  };
  hoveredIndex: number;
};

export type DailyDataType = {
  date: string;
  bucket: string;
  value: number;
};

export type ChartOptionsType = {
  dailyData: DailyDataType[];
  barChartColors: string[];
  label?: string;
};

export interface BottomAxisData {
  numBottomAxis: number;
  startBottomAxis: number;
  intervalBottomAxis: number;
}
