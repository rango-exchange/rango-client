import type { ModalContentProps } from './WalletModal.types';

import { i18n } from '@lingui/core';
import { Image, MessageBox, WalletState } from '@rango-dev/ui';
import React from 'react';

import {
  LogoContainer,
  Spinner,
  WalletImageContainer,
} from './WalletModalContent.styles';

export function ModalContent(props: ModalContentProps) {
  const { state, image, error } = props;
  if (state === WalletState.CONNECTED) {
    return (
      <MessageBox
        type="success"
        title={i18n.t('Wallet Connected')}
        description={i18n.t(
          'Your wallet is connected, you can use it to swap.'
        )}
      />
    );
  }

  if (error) {
    return (
      <MessageBox
        type="error"
        title={i18n.t('Failed to Connect')}
        description={
          error || i18n.t('Your wallet is not connected. Please try again.')
        }
      />
    );
  }

  return (
    <MessageBox
      type="loading"
      title={i18n.t('Connecting to your wallet')}
      description={i18n.t('Click connect in your wallet popup.')}
      icon={
        <LogoContainer>
          <WalletImageContainer>
            <Image src={image} size={45} />
          </WalletImageContainer>
          <Spinner />
        </LogoContainer>
      }
    />
  );
}
