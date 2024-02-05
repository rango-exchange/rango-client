import type { ModalPropTypes } from './SwapDetailsModal.types';

import { PendingSwapNetworkStatus } from 'rango-types';
import React from 'react';

import { WIDGET_UI_ID } from '../../constants';
import { WatermarkedModal } from '../common/WatermarkedModal';

import { CancelContent } from './SwapDetailsModal.Cancel';
import { DeleteContent } from './SwapDetailsModal.Delete';
import { modalNetworkValues } from './SwapDetailsModal.helpers';
import { WalletStateContent } from './SwapDetailsModal.WalletState';

export function SwapDetailsModal(props: ModalPropTypes) {
  const {
    state,
    onClose,
    onDelete,
    onCancel,
    currentStepWallet,
    message,
    walletButtonDisabled,
  } = props;

  const showWalletStateContent =
    state === PendingSwapNetworkStatus.WaitingForNetworkChange ||
    state === PendingSwapNetworkStatus.WaitingForConnectingWallet ||
    state === PendingSwapNetworkStatus.NetworkChanged;

  return (
    <WatermarkedModal
      open={!!state}
      onClose={onClose}
      container={
        document.getElementById(WIDGET_UI_ID.SWAP_BOX_ID) || document.body
      }>
      {showWalletStateContent && (
        <WalletStateContent
          type={modalNetworkValues[state].type}
          title={modalNetworkValues[state].title}
          currentStepWallet={currentStepWallet}
          message={message}
          walletButtonDisabled={walletButtonDisabled}
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
    </WatermarkedModal>
  );
}
