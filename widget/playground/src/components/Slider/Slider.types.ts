import type { ChangeEventHandler } from 'react';

export interface PropTypes {
  showValue?: boolean;
  title?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  value?: number;
  variant?: 'custom' | 'regular';
  min?: string;
  max?: string;
}
