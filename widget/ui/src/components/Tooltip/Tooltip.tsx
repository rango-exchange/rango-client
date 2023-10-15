import type { PropTypes } from './Tooltip.types';
import type { PropsWithChildren } from 'react';

import * as RadixTooltip from '@radix-ui/react-tooltip';
import React from 'react';

import {
  TooltipArrow,
  TooltipContent,
  TooltipTypography,
} from './Tooltip.styles';

export function Tooltip(props: PropsWithChildren<PropTypes>) {
  const {
    children,
    content,
    color,
    sideOffset,
    container,
    side = 'top',
  } = props;
  return (
    <RadixTooltip.Provider delayDuration={0}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
          <div>{children}</div>
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal container={container}>
          <TooltipContent side={side} sideOffset={sideOffset}>
            <TooltipTypography variant="label" size="medium" color={color}>
              {content}
            </TooltipTypography>
            <TooltipArrow />
          </TooltipContent>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
