import type { CollapsiblePropTypes } from './Collapsible.types.js';
import type { PropsWithChildren } from 'react';

import * as Collapsible from '@radix-ui/react-collapsible';
import React from 'react';

import { CollapsibleContent } from '../common/styles.js';

import { Trigger } from './Collapsible.styles.js';

export function CollapsibleComponent(
  props: PropsWithChildren<CollapsiblePropTypes>
) {
  const { open, onOpenChange, trigger, children, ...otherProps } = props;
  return (
    <Collapsible.Root open={open} onOpenChange={onOpenChange} {...otherProps}>
      <Trigger asChild>{trigger}</Trigger>
      <CollapsibleContent open={open}>{children}</CollapsibleContent>
    </Collapsible.Root>
  );
}
