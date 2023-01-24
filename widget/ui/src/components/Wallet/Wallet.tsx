import React from 'react';

import { styled } from '../../theme';
import { WalletInfo, WalletState } from '../../types/wallet';
import { Button } from '../Button/Button';
import { Typography } from '../Typography';
import { State } from './State';

const WalletImage = styled('img', {
  width: '$24',
  height: '$24',
  marginRight: '$12',
});

export type PropTypes = WalletInfo & { onClick: (walletName: string) => void };

export function Wallet(props: PropTypes) {
  const { name, image, onClick } = props;
  return (
    <Button
      type={props.state === WalletState.CONNECTED ? 'primary' : undefined}
      disabled={!props.state}
      onClick={onClick.bind(null, name)}
      align="start"
      variant="outlined"
      size="large"
      prefix={<WalletImage src={image} />}
      suffix={
        <State
          walletState={props.state}
          installLink={
            props.state === WalletState.NOT_INSTALLED
              ? props.installLink
              : undefined
          }
        />
      }
    >
      <Typography variant="h5" noWrap={false}>
        {name}
      </Typography>
    </Button>
  );
}
