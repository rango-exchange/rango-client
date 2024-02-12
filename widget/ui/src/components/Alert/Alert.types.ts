import type { ReactNode } from 'react';
import type { CSS } from 'src/theme';

export type Type = 'success' | 'warning' | 'error' | 'info' | 'loading';

export interface PropTypes {
  type: Type;
  title?: ReactNode;
  footer?: ReactNode;
  action?: ReactNode;
  variant?: 'alarm' | 'regular';
  containerStyles?: CSS;
}
