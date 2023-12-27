import type { ModalPropTypes } from './SwapDetailsModal.types';

import { Modal } from '@rango-dev/ui';
import { PendingSwapNetworkStatus } from 'rango-types';
import React from 'react';

import { RANGO_SWAP_BOX_ID } from '../../constants';

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
      container={document.getElementById(RANGO_SWAP_BOX_ID) || document.body}>
      {showWalletStateContent && (
        <WalletStateContent
          type={modalNetworkValues[state].type}
          title={modalNetworkValues[state].title}
          currentStepWallet={currentStepWallet}
          message={message}
          showWalletButton={
            state !== PendingSwapNetworkStatus.WaitingForNetworkChange
          }
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
