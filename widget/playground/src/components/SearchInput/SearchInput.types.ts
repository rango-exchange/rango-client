import type React from 'react';

export type PropTypes = {
  fullWidth?: boolean;
  color?: 'dark' | 'light';
  size?: 'small' | 'large';
  value: string;
  setValue: (value: string) => void;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'value' | 'onChange'
>;
