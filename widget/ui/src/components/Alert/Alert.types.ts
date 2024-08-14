import type { CSS } from '../../theme.js';
import type { BaseAlign } from '../Typography/Typography.types.js';
import type { ReactNode } from 'react';

export type Type = 'success' | 'warning' | 'error' | 'info' | 'loading';

export interface AlertPropTypes {
  type: Type;
  title?: ReactNode;
  footer?: ReactNode;
  action?: ReactNode;
  variant?: 'alarm' | 'regular';
  containerStyles?: CSS;
  titleAlign?: BaseAlign;
}
