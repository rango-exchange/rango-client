/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { SpinnerPropTypes } from '@arlert-dev/ui';
import type { Meta } from '@storybook/react';

import { Spinner } from '@arlert-dev/ui';
import React from 'react';

export default {
  title: 'Components/Spinner',
  component: Spinner,
  args: {
    color: 'primary',
    size: 16,
  },
  argTypes: {
    color: {
      name: 'color',
      control: { type: 'select' },
      options: ['primary', 'error', 'warning', 'success', 'black', 'white'],
      defaultValue: 'primary',
    },

    size: {
      name: 'size',
      control: { type: 'radio' },
      options: [16, 20, 24],
      defaultValue: 16,
    },
  },
} as Meta<typeof Spinner>;

export const Main = (props: SpinnerPropTypes) => <Spinner {...props} />;
