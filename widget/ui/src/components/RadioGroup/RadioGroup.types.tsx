import type { RadioPropTypes } from '../Radio/index.js';
import type { CSSProperties } from '@stitches/react';

export interface RadioGroupPropTypes {
  options: {
    label: string;
    value: RadioPropTypes['value'];
  }[];
  value: RadioPropTypes['value'];
  onChange: (value: string) => void;
  direction?: 'vertical' | 'horizontal';
  style?: CSSProperties;
}
