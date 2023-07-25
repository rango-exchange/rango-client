import * as RadixTooltip from '@radix-ui/react-tooltip';
import { styled } from '../../theme';
import React, { PropsWithChildren } from 'react';

export interface PropTypes {
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  color?:
    | 'primary'
    | 'error'
    | 'warning'
    | 'success'
    | 'gray'
    | 'white'
    | 'black';
}
const TooltipTrigger = styled(RadixTooltip.Trigger, {
  border: 0,
  padding: 0,

  backgroundColor: 'transparent',
});
const TooltipContent = styled(RadixTooltip.Content, {
  borderRadius: '$xs',
  padding: '$4 $8',
  fontSize: '$14',
  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  willChange: 'transform, opacity',
  variants: {
    color: {
      primary: {
        backgroundColor: '$primary',
        color: '$white',
      },
      error: {
        backgroundColor: '$error',
        color: '$white',
      },
      warning: {
        backgroundColor: '$warning',
        color: '$white',
      },
      success: {
        backgroundColor: '$success',
        color: '$white',
      },
      gray: {
        backgroundColor: '$neutral100',
        color: '$black',
      },
      black: {
        backgroundColor: '$black',
        color: '$white',
      },
      white: {
        backgroundColor: '$white',
        color: '$black',
      },
    },
  },
});
const TooltipArrow = styled(RadixTooltip.Arrow, {
  variants: {
    color: {
      primary: {
        fill: '$primary',
      },
      error: {
        fill: '$error',
      },
      warning: {
        fill: '$warning',
      },
      success: {
        fill: '$success',
      },
      gray: {
        fill: '$neutral100',
      },
      black: {
        fill: '$black',
      },
      white: {
        fill: '$white',
      },
    },
  },
});

const ChildrenWrapper = styled('div', {
  display: 'inline-block',
});

export function Tooltip({
  children,
  content,
  side = 'top',
  color = 'gray',
}: PropsWithChildren<PropTypes>) {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root>
        <TooltipTrigger asChild>
          <ChildrenWrapper>{children}</ChildrenWrapper>
        </TooltipTrigger>
        <RadixTooltip.Portal>
          <TooltipContent color={color} side={side} sideOffset={5}>
            {content}
            <TooltipArrow color={color} />
          </TooltipContent>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
