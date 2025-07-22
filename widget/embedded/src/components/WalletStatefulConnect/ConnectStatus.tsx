import type { ConnectStatusProps } from './ConnectStatus.types';

import { i18n } from '@lingui/core';
import { Image, MessageBox, WalletState } from '@arlert-dev/ui';
import { useWallets } from '@arlert-dev/wallets-react';
import React from 'react';

import { mapStatusToWalletState } from '../../utils/wallets';

import {
  LogoContainer,
  Spinner,
  WalletImageContainer,
} from './ConnectStatus.styles';

export function ConnectStatus(props: ConnectStatusProps) {
  // See `wallet` notes on its type definition
  const { wallet, error } = props;
  const { type, image } = wallet;
  const { state } = useWallets();
  const walletState = mapStatusToWalletState(state(type));

  if (walletState === WalletState.CONNECTED) {
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
