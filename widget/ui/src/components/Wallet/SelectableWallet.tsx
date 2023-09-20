import { detectInstallLink } from '@rango-dev/wallets-shared';
import React from 'react';

import { Image } from '../common';
import { Typography } from '../Typography';

import { makeInfo } from './Wallet.helpers';
import { Text, WalletButton, WalletImageContainer } from './Wallet.styles';
import { type SelectablePropTypes, WalletState } from './Wallet.types';

export function SelectableWallet(props: SelectablePropTypes) {
  const { title, type, image, onClick, selected, description, state } = props;
  const info = makeInfo(props.state);
  return (
    <WalletButton
      selected={selected}
      disabled={props.state == WalletState.CONNECTING}
      onClick={() => {
        if (props.state === WalletState.NOT_INSTALLED) {
          window.open(detectInstallLink(props.link), '_blank');
        } else {
          onClick(type);
        }
      }}>
      <WalletImageContainer>
        <Image src={image} size={35} />
      </WalletImageContainer>

      <Text>
        <Typography variant="label" size="medium" noWrap={false}>
          {title}
        </Typography>

        <Typography
          variant="body"
          size="xsmall"
          noWrap={false}
          color={state === WalletState.CONNECTED ? 'neutral900' : info.color}>
          {description || info.description}
        </Typography>
      </Text>
    </WalletButton>
  );
}
