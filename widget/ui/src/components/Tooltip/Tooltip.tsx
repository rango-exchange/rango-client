import type { TooltipPropTypes } from './Tooltip.types.js';
import type { PropsWithChildren } from 'react';

import * as RadixTooltip from '@radix-ui/react-tooltip';
import React from 'react';

import {
  TooltipContent,
  TooltipTypography,
  TriggerContent,
} from './Tooltip.styles.js';

export function Tooltip(props: PropsWithChildren<TooltipPropTypes>) {
  const {
    children,
    content,
    color,
    sideOffset,
    container,
    open,
    side = 'top',
    styles,
    align,
    alignOffset,
    collisionPadding,
  } = props;

  return (
    <RadixTooltip.Provider delayDuration={0}>
      <RadixTooltip.Root open={open}>
        <RadixTooltip.Trigger asChild style={styles?.root}>
          <TriggerContent>{children}</TriggerContent>
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal container={container}>
          <TooltipContent
            alignOffset={alignOffset}
            align={align}
            side={side}
            sideOffset={sideOffset}
            collisionPadding={collisionPadding}
            collisionBoundary={container}>
            <TooltipTypography
              css={styles?.content}
              variant="label"
              size="medium"
              color={color}>
              {content}
            </TooltipTypography>
          </TooltipContent>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
