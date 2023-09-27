import type { CSSProperties, ReactNode } from 'react';

export type Type = 'success' | 'warning' | 'error' | 'info' | 'loading';

export interface PropTypes {
  type: Type;
  title?: ReactNode;
  footer?: ReactNode;
  action?: ReactNode;
  variant?: 'alarm' | 'regular';
  containerStyles?: CSSProperties;
}
