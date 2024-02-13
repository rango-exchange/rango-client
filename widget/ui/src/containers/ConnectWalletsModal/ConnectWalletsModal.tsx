import type { WalletInfo } from '../../components';
import type { WalletType } from '@rango-dev/wallets-shared';

import { i18n } from '@lingui/core';
import React from 'react';

import { Modal, Wallet } from '../../components';
import { styled } from '../../theme';

export interface PropTypes {
  open: boolean;
  list: WalletInfo[];
  onSelect: (walletType: WalletType) => void;
  onClose: () => void;
  error?: string;
}

const ModalContent = styled('div', {
  display: 'grid',
  gap: '$8',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  overflow: 'auto',
});

export function ConnectWalletsModal(props: PropTypes) {
  const { open, list, onSelect, onClose } = props;

  return (
    <Modal
      title={i18n.t('Connect Wallets')}
      open={open}
      onClose={onClose}
      styles={{
        container: { width: '75%', maxWidth: '30rem', height: '60%' },
      }}>
      <ModalContent>
        {list.map((info) => (
          <Wallet {...info} key={info.title} onClick={onSelect} />
        ))}
      </ModalContent>
    </Modal>
  );
}
