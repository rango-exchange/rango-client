import type { WalletPropTypes } from './Wallet.types';

import { detectInstallLink } from '@rango-dev/wallets-shared';
import React, { Fragment } from 'react';

import { Image } from '../common';
import { Divider } from '../Divider';
import { Skeleton } from '../Skeleton';
import { Tooltip } from '../Tooltip';
import { Typography } from '../Typography';

import { makeInfo } from './Wallet.helpers';
import {
  LoadingButton,
  Text,
  Title,
  WalletButton,
  WalletImageContainer,
} from './Wallet.styles';
import { WalletState } from './Wallet.types';

function Wallet(props: WalletPropTypes) {
  const { title, type, image, onClick, isLoading, disabled = false } = props;
  const info = makeInfo(props.state);

  if (isLoading) {
    return (
      <LoadingButton>
        <Skeleton variant="circular" width={35} height={35} />
        <Divider size={12} />
        <Skeleton variant="text" width={85} size="medium" />
        <Divider size={4} />
        <Skeleton variant="text" width={64} size="medium" />
      </LoadingButton>
    );
  }

  const WrapperComponent = disabled ? Fragment : Tooltip;

  return (
    <WrapperComponent
      container={props.container}
      content={info.tooltipText}
      side="top">
      <WalletButton
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
            color={info.color}>
            {info.description}
          </Typography>
        </Text>
      </WalletButton>
    </WrapperComponent>
  );
}

export default Wallet;
