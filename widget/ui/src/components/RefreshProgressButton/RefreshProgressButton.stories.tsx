import type { SvgIconPropsWithChildren } from '../SvgIcon';
import type { Meta } from '@storybook/react';

import React from 'react';

import { RefreshProgressButton } from './RefreshProgressButton';

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
