import type { CollapsibleProps } from './Collapsible.types';

import React, { useState } from 'react';

import { ChevronDownIcon } from '../../icons';
import { Button } from '../Button';
import { Typography } from '../Typography';

import { CollapsibleComponent as Collapsible } from './Collapsible';

export default {
  title: 'Components/Collapsible',
  component: Collapsible,
  args: {
    open: false,
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
      trigger={
        <Button onClick={() => setOpen(!open)}>
          <Typography size="medium" variant="title">
            Trigger
          </Typography>
          <ChevronDownIcon size={10} color="gray" />
        </Button>
      }
      open={open || args.open}
      onOpenChange={() => setOpen(!open)}>
      <Typography size="medium" variant="title">
        Content
      </Typography>
    </Collapsible>
  );
};
