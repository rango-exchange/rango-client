import type { WalletType } from '@yeager-dev/wallets-shared';

import { ConnectWalletsModal } from '@yeager-dev/ui';
import { useWallets } from '@yeager-dev/wallets-react';
import React, { useState } from 'react';

import { mapWalletTypesToWalletInfo } from './helpers';

export interface PropTypes {
  open: boolean;
  onClose: () => void;
  list: WalletType[];
}

function Modal(props: PropTypes) {
  const { open, onClose, list } = props;
  const [walletMessage, setWalletErrorMessage] = useState('');

  const { state, disconnect, getWalletInfo, connect } = useWallets();
  const allWallets = mapWalletTypesToWalletInfo(state, getWalletInfo, list);

  const onSelectWallet = async (type: WalletType) => {
    const wallet = state(type);
    try {
      if (wallet.connected) {
        await disconnect(type);
      } else {
        await connect(type);
      }
    } catch (e) {
      if (e instanceof Error) {
        setWalletErrorMessage('Error: ' + e.message);
      }
    }
  };
  return (
    <ConnectWalletsModal
      list={allWallets}
      open={open}
      onClose={onClose}
      onSelect={onSelectWallet}
      error={walletMessage}
    />
  );
}

export default Modal;
