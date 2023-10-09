import type React from 'react';

export interface CollapsibleProps {
  trigger: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
