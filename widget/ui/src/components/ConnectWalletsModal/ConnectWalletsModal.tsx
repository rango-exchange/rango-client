import React from 'react';
import { styled } from '../../theme';
import { WalletInfo } from '../../types/wallet';
import { Modal } from '../Modal';
import { WalletType } from '@rango-dev/wallets-shared';
import { Wallet } from '../Wallet';
import { useLingui } from '@lingui/react';

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
});

export function ConnectWalletsModal(props: PropTypes) {
  const { open, list, onSelect, onClose } = props;
  const { i18n } = useLingui();

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
      containerStyle={{ width: '75%', maxWidth: '30rem', height: '70%' }}
    />
  );
}
