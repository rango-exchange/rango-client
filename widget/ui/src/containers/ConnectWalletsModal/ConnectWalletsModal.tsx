import React from 'react';
import { styled } from '../../theme';
import { WalletInfo } from '../../types/wallet';
import { WalletType } from '@rango-dev/wallets-shared';
import { Modal, Wallet } from '../../components';
import { i18n } from '@lingui/core';

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

  const Content = (
    <ModalContent>
      {list.map((info, index) => (
        <Wallet {...info} key={index} onClick={onSelect} />
      ))}
    </ModalContent>
  );

  return (
    <Modal
      title={i18n.t('Connect Wallets')}
      open={open}
      content={Content}
      onClose={onClose}
      containerStyle={{ width: '75%', maxWidth: '30rem', height: '60%' }}
    />
  );
}
