import type { ReactNode } from 'react';

export type PropTypes = {
  open: boolean;
  hasSelected?: boolean;
  onOpenChange?: (checked: boolean) => void;
  onClickTrigger: () => void;
  trigger: ReactNode;
  triggerAnchor: 'top' | 'bottom';
};
