import type { ConnectWalletsModalPropTypes } from './ConnectWalletsModal.types.js';

import { i18n } from '@lingui/core';
import React from 'react';

import { Modal, Wallet } from '../../components/index.js';

import { ModalContent } from './ConnectWalletsModal.styles.js';

export function ConnectWalletsModal(props: ConnectWalletsModalPropTypes) {
  const { open, list, onSelect, onClose, id, checkHasDeepLink, getWalletLink } =
    props;

  return (
    <Modal
      title={i18n.t('Connect Wallets')}
      open={open}
      onClose={onClose}
      id={id}
      styles={{
        container: { width: '75%', maxWidth: '30rem', height: '60%' },
      }}>
      <ModalContent>
        {list.map((info) => (
          <Wallet
            {...info}
            key={info.title}
            onClick={onSelect}
            hasDeepLink={checkHasDeepLink(info.type)}
            link={getWalletLink(info.type)}
          />
        ))}
      </ModalContent>
    </Modal>
  );
}
