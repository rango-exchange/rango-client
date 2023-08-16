import type { PropTypes } from './Button.types';
import type { Meta } from '@storybook/react';

import React from 'react';

import { WalletIcon } from '../../icons';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;

export const Main = (props: PropTypes) => (
  <Button {...props}>I'm a button</Button>
);

export const WithPrefix = (args: PropTypes) => {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    <Button prefix={<WalletIcon />} {...args}>
      I'm a button
    </Button>
  );
};

export const WithSuffix = (args: PropTypes) => (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  <Button suffix={<WalletIcon />} {...args}>
    I'm a button
  </Button>
);
