import type React from 'react';

export interface CollapsiblePropTypes {
  trigger: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
