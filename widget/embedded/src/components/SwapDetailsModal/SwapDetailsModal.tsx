import type { ModalPropTypes } from './SwapDetailsModal.types';

import React from 'react';

import { WIDGET_UI_ID } from '../../constants';
import { WatermarkedModal } from '../common/WatermarkedModal';

import { CancelContent } from './SwapDetailsModal.Cancel';
import { DeleteContent } from './SwapDetailsModal.Delete';
import { NetworkStateContent } from './SwapDetailsModal.NetworkState';
import { WalletStateContent } from './SwapDetailsModal.WalletState';

export function SwapDetailsModal(props: ModalPropTypes) {
  const { isOpen, state, onClose, onDelete, onCancel, swap, message } = props;

  return (
    <WatermarkedModal
      open={isOpen}
      onClose={onClose}
      container={
        document.getElementById(WIDGET_UI_ID.SWAP_BOX_ID) || document.body
      }>
      {state === 'waitingForConnectingWallet' && (
        <WalletStateContent swap={swap} message={message} onClose={onClose} />
      )}
      {(state === 'waitingForNetworkChange' || state === 'networkChanged') && (
        <NetworkStateContent message={message} status={state} />
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
