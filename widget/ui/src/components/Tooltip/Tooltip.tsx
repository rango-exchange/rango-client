import * as RadixTooltip from '@radix-ui/react-tooltip';
import React, { PropsWithChildren, useState } from 'react';
import useEventListener from './useEventListener';
import { TooltipTypography } from './Tooltip.styles';
import { PropTypes } from './Tooltip.types';

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
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}>
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
            <TooltipTypography
              variant="label"
              size="medium"
              color={color || 'neutral900'}>
              {content}
            </TooltipTypography>
          </RadixTooltip.Content>
        </RadixTooltip.Root>
      </RadixTooltip.Provider>
    </>
  );
}
