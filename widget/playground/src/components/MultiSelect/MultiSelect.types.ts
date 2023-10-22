import type { MultiListPropTypes } from '../MultiList/MultiList.types';

export type PropTypes = MultiListPropTypes & {
  value?: string[];
};

export interface MultiSelectChipProps {
  label: string;
  variant?: 'contained' | 'outlined';
}
