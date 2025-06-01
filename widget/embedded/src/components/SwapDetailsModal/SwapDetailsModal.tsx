import type { ModalPropTypes } from './SwapDetailsModal.types';

import React from 'react';

import { getContainer } from '../../utils/common';
import { WatermarkedModal } from '../common/WatermarkedModal';

import { CancelContent } from './SwapDetailsModal.Cancel';
import { DeleteContent } from './SwapDetailsModal.Delete';
import { NetworkStateContent } from './SwapDetailsModal.NetworkState';
import { WalletStateContent } from './SwapDetailsModal.WalletState';

export function SwapDetailsModal(props: ModalPropTypes) {
  const {
    isOpen,
    state,
    switchNetworkModalState,
    onClose,
    onDelete,
    onCancel,
    swap,
    message,
    handleSwitchNetwork,
  } = props;

  return (
    <WatermarkedModal
      open={isOpen}
      onClose={onClose}
      container={getContainer()}>
      {state === 'connectWallet' && (
        <WalletStateContent swap={swap} message={message} onClose={onClose} />
      )}
      {state === 'switchNetwork' && switchNetworkModalState && (
        <NetworkStateContent
          message={message}
          switchNetworkModalState={switchNetworkModalState}
          handleSwitchNetwork={handleSwitchNetwork}
        />
      )}
      {state === 'delete' && (
        <DeleteContent
          onClose={onClose}
          onDelete={() => {
            onClose();
            onDelete();
          }}
        />
      )}
      {state === 'cancel' && (
        <CancelContent
          onClose={onClose}
          onCancel={() => {
            onClose();
            onCancel();
          }}
        />
      )}
    </WatermarkedModal>
  );
}
