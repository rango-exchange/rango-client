import type { PropTypes } from './NotFound.types';
import type { Meta } from '@storybook/react';

import React from 'react';

import { NotFound } from './NotFound';

export default {
  title: 'Components/NotFound',
  component: NotFound,
  args: {
    title: 'Not Found!',
    description: 'Try using different keywords',
  },
} as Meta<typeof NotFound>;

export const Main = (args: PropTypes) => <NotFound {...args} />;
