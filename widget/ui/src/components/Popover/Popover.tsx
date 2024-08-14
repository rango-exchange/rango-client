import type { ContentType, PopoverPropTypes, Ref } from './Popover.types.js';
import type { PropsWithChildren } from 'react';

import * as RadixPopover from '@radix-ui/react-popover';
import React from 'react';

import { PopoverArrow, PopoverContainer } from './Popover.styles.js';

const DEFAULT_SIDE_OFFSET = 0;
const DEFAULT_ALIGN_OFFSET = 0;

export const PopoverContentComponent = (
  props: PropsWithChildren<ContentType>,
  forwardedRef: Ref
) => {
  const { container, children, styles, hasArrow = true, ...rest } = props;
  return (
    <RadixPopover.Portal container={container}>
      <PopoverContainer {...rest} ref={forwardedRef}>
        {children}
        {hasArrow && <PopoverArrow css={styles?.arrowStyles} />}
      </PopoverContainer>
    </RadixPopover.Portal>
  );
};

const PopoverContent = React.forwardRef(PopoverContentComponent);
PopoverContent.displayName = 'PopoverContent';

export function Popover(props: PropsWithChildren<PopoverPropTypes>) {
  const {
    children,
    content,
    side = 'bottom',
    sideOffset = DEFAULT_SIDE_OFFSET,
    alignOffset = DEFAULT_ALIGN_OFFSET,
    align = 'center',
    collisionBoundary = [],
    collisionPadding = 0,
    container = document.body,
    onOpenChange,
    open,
    ...rest
  } = props;
  return (
    <RadixPopover.Root onOpenChange={onOpenChange} open={open}>
      <RadixPopover.Trigger asChild>{children}</RadixPopover.Trigger>
      <PopoverContent
        align={align}
        alignOffset={alignOffset}
        collisionBoundary={collisionBoundary}
        collisionPadding={collisionPadding}
        side={side}
        sideOffset={sideOffset}
        container={container}
        {...rest}>
        {content}
      </PopoverContent>
    </RadixPopover.Root>
  );
}
