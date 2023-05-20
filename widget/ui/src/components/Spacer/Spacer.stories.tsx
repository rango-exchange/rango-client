import { Meta } from '@storybook/react';
import React from 'react';
import { Typography } from '../Typography';
import { Spacer, PropTypes } from './Spacer';

export default {
  title: 'Components/Spacer',
  component: Spacer,
  args: {
    size: 12,
    direction: 'horizontal',
  },
  argTypes: {
    size: {
      name: 'size',
      control: { type: 'select' },
      options: [12, 16, 18, 20],
      defaultValue: 12,
    },
    direction: {
      name: 'direction',
      control: { type: 'select' },
      options: ['vertical', 'horizontal'],
      defaultValue: 'horizontal',
    },
  },
} as Meta<typeof Spacer>;

export const Main = (props: PropTypes) => (
  <div style={{ display: props.direction === 'horizontal' ? 'flex' : 'block' }}>
    <Typography variant="body1">spacer </Typography>
    <Spacer {...props} />
    <Typography variant="body1">spacer</Typography>
  </div>
);
