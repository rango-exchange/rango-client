import type { MarketingMetaData } from '../MultiSelect/MultiSelect.types';

export type PropTypes = {
  title: string;
  icon: React.ReactNode;
  defaultValue?: string | null;
  onChange: (item: string) => void;
  list: {
    name: string;
    value: string | null;
    image?: string;
    Icon?: React.ComponentType<{ size?: number }>;
  }[];
  searchPlaceholder?: string;
} & MarketingMetaData;
