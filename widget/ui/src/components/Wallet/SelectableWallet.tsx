import { detectInstallLink } from '@rango-dev/wallets-shared';
import React from 'react';

import { Image } from '../common/index.js';
import { Typography } from '../Typography/index.js';

import {
  SelectableWalletButton,
  Text,
  Title,
  WalletImageContainer,
} from './Wallet.styles.js';
import { type SelectablePropTypes, WalletState } from './Wallet.types.js';

export function SelectableWallet(props: SelectablePropTypes) {
  const {
    title,
    type,
    image,
    onClick,
    selected,
    id,
    description,
    descriptionColor,
    disabled = false,
  } = props;

  return (
    <SelectableWalletButton
      selected={selected}
      id={id}
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
          color={descriptionColor}>
          {description}
        </Typography>
      </Text>
    </SelectableWalletButton>
  );
}
