import type { CSS } from '../../theme';
import type * as RadixTooltip from '@radix-ui/react-tooltip';
import type * as Stitches from '@stitches/react';
import type { ComponentProps, ReactNode } from 'react';

type RadixTooltipContentProps = ComponentProps<typeof RadixTooltip.Content>;

export interface TooltipPropTypes {
  content: ReactNode;
  side?: RadixTooltipContentProps['side'];
  color?: 'primary' | 'error' | 'warning' | 'success';
  sideOffset?: RadixTooltipContentProps['sideOffset'];
  container?: HTMLElement;
  open?: boolean;
  styles?: {
    root?: Stitches.CSSProperties;
    content?: CSS;
  };
  align?: RadixTooltipContentProps['align'];
}
