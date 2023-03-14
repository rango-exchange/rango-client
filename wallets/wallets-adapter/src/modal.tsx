import { ConnectWalletsModal } from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-core';
import { WalletType } from '@rango-dev/wallets-shared';
import React, { useState } from 'react';
import { getlistWallet } from './helpers';
export interface PropTypes {
  open: boolean;
  onClose: () => void;
  list: WalletType[];
}

function Modal(props: PropTypes) {
  const { open, onClose, list } = props;
  const [walletMessage, setWalletErrorMessage] = useState('');

  const { state, disconnect, getWalletInfo, connect } = useWallets();
  const allWallets = getlistWallet(state, getWalletInfo, list);

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
