import type { ConnectWalletsModalPropTypes } from '@arlert-dev/ui';
import type { Meta } from '@storybook/react';

import { ConnectWalletsModal } from '@arlert-dev/ui';
import React, { useState } from 'react';

import { walletsInfo } from './mock';

export default {
  title: 'Containers/Connect Wallets Modal',
  component: ConnectWalletsModal,
} as Meta<typeof ConnectWalletsModal>;

export const Main = (args: ConnectWalletsModalPropTypes) => {
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
