import type { MultiListPropTypes } from '../MultiList/MultiList.types';

export type PropTypes = Omit<MultiListPropTypes, 'showCategory'> & {
  value?: string[];
};

export interface MultiSelectChipProps {
  label: string;
  variant?: 'contained' | 'outlined';
}
