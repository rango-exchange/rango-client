import React from 'react';
import { ComponentMeta } from '@storybook/react';
import ConnectWalletsModal, { PropTypes } from './ConnectWalletsModal';
import { walletsInfo } from './mockData';

export default {
  title: 'Connect Wallets Modal',
  component: ConnectWalletsModal,
} as ComponentMeta<typeof ConnectWalletsModal>;

export const Main = (args: PropTypes) => (
  <ConnectWalletsModal {...args} list={walletsInfo} />
);
