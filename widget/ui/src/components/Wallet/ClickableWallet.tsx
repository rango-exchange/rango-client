import type { WalletPropTypes } from './Wallet.types.js';

import { detectInstallLink } from '@rango-dev/wallets-shared';
import React from 'react';

import { Image } from '../common/index.js';
import { Divider } from '../Divider/index.js';
import { Skeleton } from '../Skeleton/index.js';
import { Tooltip } from '../Tooltip/index.js';
import { Typography } from '../Typography/index.js';

import { makeInfo } from './Wallet.helpers.js';
import {
  LoadingButton,
  Text,
  Title,
  WalletButton,
  WalletImageContainer,
} from './Wallet.styles.js';
import { WalletState } from './Wallet.types.js';

function Wallet(props: WalletPropTypes) {
  const {
    title,
    type,
    image,
    onClick,
    isLoading,
    disabled = false,
    canOpenDeepLink,
    deepLink,
  } = props;
  const info = makeInfo(props.state, canOpenDeepLink);

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

  const wrapComponentWithTooltip = (children: React.ReactNode) => {
    if (disabled) {
      return <>{children}</>;
    }
    return (
      <Tooltip
        container={props.container}
        content={info.tooltipText}
        side="top"
      >
        {children}
      </Tooltip>
    );
  };

  return wrapComponentWithTooltip(
    <WalletButton
      className={'widget-clickable-wallet-btn'}
      disabled={props.state == WalletState.CONNECTING || disabled}
      onClick={() => {
        if (
          props.state === WalletState.NOT_INSTALLED &&
          canOpenDeepLink &&
          deepLink
        ) {
          window.open(deepLink, '_blank');
        } else if (props.state === WalletState.NOT_INSTALLED) {
          window.open(detectInstallLink(props.link), '_blank');
        } else {
          onClick(type);
        }
      }}
    >
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
          color={info.color}
        >
          {info.description}
        </Typography>
      </Text>
    </WalletButton>
  );
}

export default Wallet;
