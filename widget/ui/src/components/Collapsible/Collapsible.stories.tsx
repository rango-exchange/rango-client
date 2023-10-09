import type { CollapsibleProps } from './Collapsible.types';

import React, { useState } from 'react';

import { ChevronUpIcon } from '../../icons';
import { Typography } from '../Typography';

import { CollapsibleComponent as Collapsible } from './Collapsible';

export default {
  title: 'Components/Collapsible',
  component: Collapsible,
  args: {
    open: false,
    trigger: (
      <>
        <Typography size="medium" variant="title">
          Trigger
        </Typography>
        <ChevronUpIcon size={10} color="gray" />
      </>
    ),
  },
  argTypes: {
    open: {
      name: 'open',
      defaultValue: false,
      control: { type: 'boolean' },
    },
  },
};

export const Main = (args: CollapsibleProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Collapsible
      {...args}
      open={open || args.open}
      onOpenChange={() => setOpen(!open)}>
      <Typography size="medium" variant="title">
        Content
      </Typography>
    </Collapsible>
  );
};
