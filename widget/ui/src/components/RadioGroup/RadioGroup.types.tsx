import type { PropTypes as RadioType } from '../Radio/Radio.types';
import type { CSSProperties } from '@stitches/react';

export interface PropTypes {
  options: {
    label: string;
    value: RadioType['value'];
  }[];
  value: RadioType['value'];
  onChange: (value: string) => void;
  direction?: 'vertical' | 'horizontal';
  style?: CSSProperties;
}
