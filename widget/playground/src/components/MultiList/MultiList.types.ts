import type { CommonListProps } from '../MultiSelect/MultiSelect.types';

export type MultiListPropTypes = {
  label: string;
  icon: React.ReactNode;
  showCategory?: boolean;
} & CommonListProps;
