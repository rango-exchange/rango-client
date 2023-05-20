import React, { useState } from 'react';
import { Meta } from '@storybook/react';
import { ConnectWalletsModal, PropTypes } from './ConnectWalletsModal';
import { walletsInfo } from './mockData';

export default {
  title: 'Containers/Connect Wallets Modal',
  component: ConnectWalletsModal,
} as Meta<typeof ConnectWalletsModal>;

export const Main = (args: PropTypes) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <ConnectWalletsModal
        {...args}
        list={walletsInfo}
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};
