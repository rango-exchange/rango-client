import type { ModalPropTypes } from './SwapDetailsModal.types';

import { PendingSwapNetworkStatus } from '@rango-dev/queue-manager-rango-preset';
import { Modal } from '@rango-dev/ui';
import React from 'react';

import { CancelContent } from './SwapDetailsModal.Cancel';
import { DeleteContent } from './SwapDetailsModal.Delete';
import { modalNetworkValues } from './SwapDetailsModal.helpers';
import { WalletStateContent } from './SwapDetailsModal.WalletState';

export function SwapDetailsModal(props: ModalPropTypes) {
  const { state, onClose, onDelete, onCancel, currentStepWallet, message } =
    props;

  const showWalletStateContent =
    state === PendingSwapNetworkStatus.WaitingForNetworkChange ||
    state === PendingSwapNetworkStatus.WaitingForConnectingWallet ||
    state === PendingSwapNetworkStatus.NetworkChanged;

  return (
    <Modal
      open={!!state}
      onClose={onClose}
      container={document.getElementById('swap-box') || document.body}>
      {showWalletStateContent && (
        <WalletStateContent
          type={modalNetworkValues[state].type}
          title={modalNetworkValues[state].title}
          currentStepWallet={currentStepWallet}
          message={message}
        />
      )}
      {state === 'delete' && (
        <DeleteContent onClose={onClose} onDelete={onDelete} />
      )}
      {state === 'cancel' && (
        <CancelContent onClose={onClose} onCancel={onCancel} />
      )}
    </Modal>
  );
}
