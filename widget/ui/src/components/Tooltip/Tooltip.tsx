import type { PropTypes } from './Tooltip.types';
import type { PropsWithChildren } from 'react';

import * as RadixTooltip from '@radix-ui/react-tooltip';
import React from 'react';

import {
  TooltipContent,
  TooltipTypography,
  TriggerContent,
} from './Tooltip.styles';

export function Tooltip(props: PropsWithChildren<PropTypes>) {
  const {
    children,
    content,
    color,
    sideOffset,
    container,
    open,
    side = 'top',
    style,
    align,
  } = props;
  return (
    <RadixTooltip.Provider delayDuration={0}>
      <RadixTooltip.Root open={open}>
        <RadixTooltip.Trigger asChild style={style}>
          <TriggerContent>{children}</TriggerContent>
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal container={container}>
          <TooltipContent align={align} side={side} sideOffset={sideOffset}>
            <TooltipTypography variant="label" size="medium" color={color}>
              {content}
            </TooltipTypography>
          </TooltipContent>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
