import { ComponentMeta } from '@storybook/react';
import React from 'react';
import { Spacer, PropTypes } from './Spacer';

export default {
  title: 'Components/Spacer',
  component: Spacer,
  argTypes: {
    size: {
      name: 'size',
      control: { type: 'select' },
      options: [12, 16, 18, 20],
      defaultValue: 12,
    },
  },
} as ComponentMeta<typeof Spacer>;

export const Main = (props: PropTypes) => <Spacer {...props} />;
