import React from 'react';
import { Meta } from '@storybook/react';

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
} as Meta<typeof Typography>;

export const Main = (props: PropTypes) => (
  <div>
    <Typography {...props} variant="display" size="small">
      Heading 1
    </Typography>
    <Typography {...props} variant="headline" size="large">
      Heading 2
    </Typography>
    <Typography {...props} variant="headline" size="xsmall">
      Heading 3
    </Typography>
    <Typography {...props} variant="title" size="medium">
      Heading 4
    </Typography>
    <Typography {...props} variant="title" size="xmedium">
      Heading 5
    </Typography>
    <Typography {...props} variant="title" size="small">
      Heading 6
    </Typography>
    <Typography {...props} variant="body" size="medium">
      Body 1
    </Typography>
    <Typography {...props} variant="body" size="medium">
      Body 2
    </Typography>
    <Typography {...props} variant="body" size="small">
      Body 3
    </Typography>
    <Typography {...props} variant="body" size="xsmall">
      Caption
    </Typography>
  </div>
);
