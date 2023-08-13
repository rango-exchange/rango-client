import type { WalletPropTypes } from './Wallet.types';

import { detectInstallLink } from '@rango-dev/wallets-shared';
import React from 'react';

import { Image } from '../common';
import { Tooltip } from '../Tooltip';
import { Typography } from '../Typography';

import { makeInfo } from './Wallet.helpers';
import { Text, WalletButton, WalletImageContainer } from './Wallet.styles';
import { WalletState } from './Wallet.types';

function Wallet(props: WalletPropTypes) {
  const { title, type, image, onClick } = props;
  const info = makeInfo(props.state);

  return (
    <Tooltip content={info.tooltipText} side="bottom">
      <WalletButton
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
            color={info.color}>
            {info.description}
          </Typography>
        </Text>
      </WalletButton>
    </Tooltip>
  );
}

export default Wallet;
