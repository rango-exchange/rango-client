import type { PropTypes } from './IconButton.types';
import type { Meta } from '@storybook/react';

import React from 'react';

import { WalletIcon } from '../../icons';

import { IconButton } from './IconButton';

const meta: Meta<typeof IconButton> = {
  component: IconButton,
};

export default meta;

export const Main = (props: PropTypes) => (
  <IconButton {...props}>
    <WalletIcon />
  </IconButton>
);
