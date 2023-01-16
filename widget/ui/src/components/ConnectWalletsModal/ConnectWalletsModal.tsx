import React from 'react';
import { styled } from '../../theme';
import { WalletInfo } from '../../types/wallet';
import Modal from '../Modal';
import WalletChip from '../WalletChip/WalletChip';

export interface PropTypes {
  open: boolean;
  walletsInfo: WalletInfo[];
  onWalletClick: (walletName: string) => void;
  onClose: () => void;
}

const ModalContent = styled('div', {
  display: 'grid',
  gap: '.5rem',
  gridTemplateColumns: ' repeat(2, minmax(0, 1fr))',
});

function ConnectWalletsModal(props: PropTypes) {
  const { open, walletsInfo, onWalletClick, onClose } = props;

  const Content = (
    <ModalContent>
      {walletsInfo.map((info, index) => (
        <WalletChip {...info} key={index} onClick={onWalletClick} />
      ))}
    </ModalContent>
  );

  return (
    <Modal
      title="Connect Wallets"
      open={open}
      content={Content}
      onClose={onClose}
      containerStyle={{ width: '75%', maxWidth: '30rem', height: '70%' }}
    />
  );
}

export default ConnectWalletsModal;
