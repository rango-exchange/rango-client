import type { PropTypes } from './Typography.types';
import type { Meta } from '@storybook/react';

import React from 'react';

import { Typography } from './Typography';

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
} satisfies Meta<typeof Typography>;

export const Main = (props: PropTypes) => (
  <div>
    <div>
      <Typography {...props} variant="display" size="large">
        Display Large
      </Typography>
      {', '}
      <Typography {...props} variant="display" size="medium">
        Display Medium
      </Typography>
      {', '}
      <Typography {...props} variant="display" size="small">
        Display Small
      </Typography>
    </div>

    <div>
      <Typography {...props} variant="headline" size="large">
        Headline Large
      </Typography>
      {', '}
      <Typography {...props} variant="headline" size="medium">
        Headline Medium
      </Typography>
      {', '}
      <Typography {...props} variant="headline" size="small">
        Headline Small
      </Typography>
      {', '}
      <Typography {...props} variant="headline" size="xsmall">
        Headline Xsmall
      </Typography>
    </div>

    <div>
      <Typography {...props} variant="title" size="large">
        Title Large
      </Typography>
      {', '}
      <Typography {...props} variant="title" size="medium">
        Title Medium
      </Typography>
      {', '}
      <Typography {...props} variant="title" size="xmedium">
        Title Xmedium
      </Typography>
      {', '}
      <Typography {...props} variant="title" size="small">
        Title Small
      </Typography>
    </div>

    <div>
      <Typography {...props} variant="label" size="large">
        Label Large
      </Typography>
      {', '}
      <Typography {...props} variant="label" size="medium">
        Label Medium
      </Typography>
      {', '}
      <Typography {...props} variant="label" size="small">
        Label Small
      </Typography>
    </div>

    <div>
      <Typography {...props} variant="body" size="large">
        Body Large
      </Typography>
      {', '}
      <Typography {...props} variant="body" size="medium">
        Body Medium
      </Typography>
      {', '}
      <Typography {...props} variant="body" size="small">
        Body Small
      </Typography>
      {', '}
      <Typography {...props} variant="body" size="xsmall">
        Body Xsmall
      </Typography>
    </div>
  </div>
);
