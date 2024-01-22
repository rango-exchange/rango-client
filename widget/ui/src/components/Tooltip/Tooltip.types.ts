import type { TooltipContent } from './Tooltip.styles';
import type * as RadixTooltip from '@radix-ui/react-tooltip';
import type * as Stitches from '@stitches/react';
import type { ComponentProps, ReactNode } from 'react';

type RadixTooltipContentProps = ComponentProps<typeof RadixTooltip.Content>;
type BaseProps = Stitches.VariantProps<typeof TooltipContent>;
type BaseAlign = Exclude<BaseProps['align'], object>;

export interface PropTypes {
  content: ReactNode;
  side?: RadixTooltipContentProps['side'];
  color?: 'primary' | 'error' | 'warning' | 'success';
  sideOffset?: RadixTooltipContentProps['sideOffset'];
  container?: HTMLElement;
  open?: boolean;
  style?: Stitches.CSSProperties;
  align?: BaseAlign;
}
