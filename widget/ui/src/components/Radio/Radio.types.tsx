import { CSSProperties } from '@stitches/react';

export interface PropTypes {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  direction?: 'vertical' | 'horizontal';
  style?: CSSProperties;
}
