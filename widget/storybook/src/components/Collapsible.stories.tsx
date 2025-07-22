import type { CollapsiblePropTypes } from '@arlert-dev/ui';

import {
  Button,
  ChevronDownIcon,
  Collapsible,
  Typography,
} from '@arlert-dev/ui';
import React, { useState } from 'react';

export default {
  title: 'Components/Collapsible',
  component: Collapsible,
  args: {
    open: false,
    trigger: <></>,
  },
  argTypes: {
    open: {
      defaultValue: false,
      control: { type: 'boolean' },
    },
    onOpenChange: {
      type: 'function',
    },
  },
};

export const Main = (args: CollapsiblePropTypes) => {
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
