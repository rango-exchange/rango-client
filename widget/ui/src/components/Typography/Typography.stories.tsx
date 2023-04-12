import React from 'react';
import { ComponentMeta } from '@storybook/react';

import { Typography, PropTypes } from './Typography';

export default {
  title: 'Components/Typography',
  component: Typography,
  argTypes: {
    variant: {
      name: 'variant',
      control: { type: 'select' },
      options: [
        'body1',
        'body2',
        'body3',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'caption',
      ],
      defaultValue: 'h1',
    },
    align: {
      name: 'align',
      control: { type: 'select' },
      options: ['center', 'left', 'right'],
    },
    noWrap: {
      name: 'noWrap',
      control: { type: 'boolean' },
    },
  },
} as ComponentMeta<typeof Typography>;

export const Main = (props: PropTypes) => (
  <div>
    <Typography {...props} variant="h1">
      Heading 1
    </Typography>
    <Typography {...props} variant="h2">
      Heading 2
    </Typography>
    <Typography {...props} variant="h3">
      Heading 3
    </Typography>
    <Typography {...props} variant="h4">
      Heading 4
    </Typography>
    <Typography {...props} variant="h5">
      Heading 5
    </Typography>
    <Typography {...props} variant="h6">
      Heading 6
    </Typography>
    <Typography {...props} variant="body1">
      Body 1
    </Typography>
    <Typography {...props} variant="body2">
      Body 2
    </Typography>
    <Typography {...props} variant="body3">
      Body 3
    </Typography>
    <Typography {...props} variant="caption">
      Caption
    </Typography>
  </div>
);
