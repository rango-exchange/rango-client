import { detectInstallLink, WalletType } from '@rango-dev/wallets-shared';
import React from 'react';

import { styled } from '../../theme';
import { WalletInfo, WalletState } from '../../types/wallet';
import { Button } from '../Button/Button';
import { Typography } from '../Typography';
import { State } from './State';
import { Image } from '../common';

const WalletImageContainer = styled('div', {
  paddingRight: '$12',
});
const Text = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});

const ExtendedButton = styled(Button, {
  variants: {
    type: {
      primary: {
        outline: '1px solid $primary',
        borderColor: '$primary',

        '&:hover': {
          borderColor: '$primary',
        },
      },
    },
  },
});

export type PropTypes = WalletInfo & {
  onClick: (walletType: WalletType) => void;
};

export function Wallet(props: PropTypes) {
  const { name, type, image, state, onClick, installLink } = props;

  return (
    <ExtendedButton
      type={state === WalletState.CONNECTED ? 'primary' : undefined}
      disabled={state == WalletState.CONNECTING}
      onClick={() => {
        if (state === WalletState.NOT_INSTALLED) {
          window.open(detectInstallLink(installLink), '_blank');
        } else onClick(type);
      }}
      align="start"
      variant="outlined"
      size="large"
      prefix={
        <WalletImageContainer>
          <Image src={image} size={24} />
        </WalletImageContainer>
      }
      suffix={<State walletState={state} installLink={installLink} />}
    >
      <Text>
        <Typography variant="h5" noWrap={false}>
          {name}
        </Typography>
        {state === WalletState.CONNECTED ? (
          <Typography variant="caption" noWrap={false} color="primary">
            Connected
          </Typography>
        ) : null}
      </Text>
    </ExtendedButton>
  );
}
