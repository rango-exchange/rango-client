import type { ReactNode } from 'react';

export interface PropTypes {
  content: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  color?: 'primary' | 'error' | 'warning' | 'success';
}
