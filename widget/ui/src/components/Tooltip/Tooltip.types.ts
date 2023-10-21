import type * as RadixTooltip from '@radix-ui/react-tooltip';
import type { ComponentProps, ReactNode } from 'react';

type RadixTooltipContentProps = ComponentProps<typeof RadixTooltip.Content>;

export interface PropTypes {
  content: ReactNode;
  side?: RadixTooltipContentProps['side'];
  color?: 'primary' | 'error' | 'warning' | 'success';
  sideOffset?: RadixTooltipContentProps['sideOffset'];
  container?: HTMLElement;
  open?: boolean;
}
