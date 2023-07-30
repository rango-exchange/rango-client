import * as RadixTooltip from '@radix-ui/react-tooltip';
import { styled } from '../../theme';
import React, { PropsWithChildren, useState } from 'react';
import useEventListener from './useEventListener';
import { Typography } from '../Typography';

export interface PropTypes {
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  color?: 'primary' | 'error' | 'warning' | 'success' | 'gray';
}
const TooltipTypography = styled(Typography, {
  borderRadius: '$md',
  padding: '$5 $10',
  boxShadow: '5px 5px 10px 0px rgba(0, 0, 0, 0.10)',
  backgroundColor: '$surface100',
});

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
