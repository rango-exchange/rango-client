import type { PropTypes } from './Tooltip.types';
import type { PropsWithChildren } from 'react';

import * as RadixTooltip from '@radix-ui/react-tooltip';
import React, { useState } from 'react';

import { TooltipTypography } from './Tooltip.styles';
import useEventListener from './useEventListener';

export function Tooltip({
  children,
  content,
  side = 'top',
  color,
}: PropsWithChildren<PropTypes>) {
  const [open, setOpen] = useState<boolean>(false);
  const [{ clientX, clientY }, setPosition] = useState({
    clientX: 0,
    clientY: 0,
  });
  useEventListener('mousemove', ({ clientX, clientY }) =>
    setPosition({ clientX, clientY })
  );
  return (
    <>
      <div
        style={{ display: 'contents' }}
        onMouseOver={() => setOpen(true)}
        onMouseOut={() => setOpen(false)}>
        {children}
      </div>
      <RadixTooltip.Provider>
        <RadixTooltip.Root open={open}>
          <RadixTooltip.Trigger asChild>
            <div
              style={{
                position: 'fixed',
                pointerEvents: 'none',
                top: `${clientY}px`,
                left: `${clientX}px`,
              }}
            />
          </RadixTooltip.Trigger>
          <RadixTooltip.Content
            key={`${clientX}${clientY}`}
            sideOffset={20}
            side={side}>
            <TooltipTypography variant="label" size="medium" color={color}>
              {content}
            </TooltipTypography>
          </RadixTooltip.Content>
        </RadixTooltip.Root>
      </RadixTooltip.Provider>
    </>
  );
}
