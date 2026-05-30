import type {
  CommonListProps,
  MarketingMetaData,
} from '../MultiSelect/MultiSelect.types';

export type MultiListPropTypes = {
  label: string;
  icon: React.ReactNode;
  showCategory?: boolean;
} & CommonListProps &
  MarketingMetaData;
