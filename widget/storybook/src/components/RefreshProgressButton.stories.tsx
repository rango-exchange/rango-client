import type { SvgIconPropsWithChildren } from '@arlert-dev/ui';
import type { Meta } from '@storybook/react';

import { RefreshProgressButton } from '@arlert-dev/ui';
import React from 'react';

export default {
  title: 'Components/RefreshProgressButton',
  component: RefreshProgressButton,
  args: {
    size: 22,
    color: 'black',
    progress: 20,
  },
} as Meta<typeof RefreshProgressButton>;

export const Main = (args: SvgIconPropsWithChildren & { progress: number }) => (
  <RefreshProgressButton {...args} />
);
