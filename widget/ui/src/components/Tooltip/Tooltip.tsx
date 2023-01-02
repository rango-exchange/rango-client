import * as RadixTooltip from '@radix-ui/react-tooltip';
import { styled } from '@stitches/react';
import React, { PropsWithChildren } from 'react';

export interface PropTypes {
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
}
const TooltipContent = styled(RadixTooltip.Content, {
  borderRadius: 5,
  padding: '$m $l',
  fontSize: '$l',
  color: '$text01',
  backgroundColor: '$white',
  boxShadow:
    'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  willChange: ' transform, opacity',
});
const TooltipArrow = styled(RadixTooltip.Arrow, {
  fill: '$white',
});

function Tooltip({ children, content, side }: PropsWithChildren<PropTypes>) {
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
