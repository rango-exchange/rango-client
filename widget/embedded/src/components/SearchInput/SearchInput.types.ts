import type * as Stitches from '@stitches/react';
import type React from 'react';

export type PropTypes = {
  variant?: 'contained' | 'outlined' | 'ghost';
  fullWidth?: boolean;
  color?: 'dark' | 'light';
  size?: 'small' | 'large';
  value: string;
  setValue?: (value: string) => void;
  style?: Stitches.CSS;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'>;
