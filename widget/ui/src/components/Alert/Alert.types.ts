import type { ReactNode } from 'react';

export type Type = 'success' | 'warning' | 'error' | 'info';

export interface PropTypes {
  type: Type;
  title?: string;
  footer?: ReactNode;
  action?: ReactNode;
  variant?: 'alarm' | 'regular';
}
