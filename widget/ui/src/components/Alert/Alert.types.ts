import type { CSS } from '../../theme';
import type { BaseAlign } from '../Typography/Typography.types';
import type { ReactNode } from 'react';

export type Type = 'success' | 'warning' | 'error' | 'info' | 'loading';

export interface PropTypes {
  type: Type;
  title?: ReactNode;
  footer?: ReactNode;
  action?: ReactNode;
  variant?: 'alarm' | 'regular';
  containerStyles?: CSS;
  titleAlign?: BaseAlign;
}
