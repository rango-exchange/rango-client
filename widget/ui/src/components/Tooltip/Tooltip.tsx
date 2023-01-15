import * as RadixTooltip from '@radix-ui/react-tooltip';
import { styled } from '@stitches/react';
import React, { PropsWithChildren } from 'react';

export interface PropTypes {
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
}
const TooltipContent = styled(RadixTooltip.Content, {
  borderRadius: '$s',
  padding: '$2 $3',
  fontSize: '$l',
  color: '$text',
  backgroundColor: '$backgroundColor2',
  boxShadow: '$s',
  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  willChange: ' transform, opacity',
});
const TooltipArrow = styled(RadixTooltip.Arrow, {
  fill: '$backgroundColor2',
});

function Tooltip({
  children,
  content,
  side = 'top',
}: PropsWithChildren<PropTypes>) {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <TooltipContent side={side} sideOffset={5}>
            {content}
            <TooltipArrow />
          </TooltipContent>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}

export default Tooltip;
