import { detectInstallLink } from '@rango-dev/wallets-shared';
import React from 'react';

import { Image } from '../common';
import { Typography } from '../Typography';

import { makeInfo } from './Wallet.helpers';
import {
  Text,
  Title,
  WalletButton,
  WalletImageContainer,
} from './Wallet.styles';
import { type SelectablePropTypes, WalletState } from './Wallet.types';

export function SelectableWallet(props: SelectablePropTypes) {
  const {
    title,
    type,
    image,
    onClick,
    selected,
    description,
    state,
    disabled = false,
  } = props;
  const info = makeInfo(props.state);
  return (
    <WalletButton
      selected={selected}
      disabled={props.state == WalletState.CONNECTING || disabled}
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
        <Title variant="label" size="medium" noWrap={false}>
          {title}
        </Title>

        <Typography
          variant="body"
          size="xsmall"
          noWrap={false}
          color={state === WalletState.CONNECTED ? 'neutral700' : info.color}>
          {description || info.description}
        </Typography>
      </Text>
    </WalletButton>
  );
}
