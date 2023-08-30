import type { PropTypes } from './WalletModal.types';

import { BottomLogo, Divider, Modal } from '@rango-dev/ui';
import React from 'react';

import { ModalContent } from './WalletModalContent';

export function WalletModal(props: PropTypes) {
  const { open, onClose, ...otherProps } = props;

  return (
    <Modal
      open={open}
      onClose={onClose}
      container={document.getElementById('swap-box') || document.body}>
      <ModalContent {...otherProps} />
      <Divider direction="vertical" size={32} />
      <BottomLogo />
    </Modal>
  );
}
