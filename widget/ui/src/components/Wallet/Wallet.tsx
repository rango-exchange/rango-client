import { detectInstallLink, WalletType } from '@rango-dev/wallets-shared';
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

export type PropTypes = WalletInfo & {
  onClick: (walletType: WalletType) => void;
};

export function Wallet(props: PropTypes) {
  const { name, type, image, state, onClick, installLink } = props;
  return (
    <Button
      type={state === WalletState.CONNECTED ? 'primary' : undefined}
      disabled={!state}
      onClick={() => {
        if (state === WalletState.NOT_INSTALLED) {
          window.open(detectInstallLink(installLink), '_blank');
        } else onClick(type);
      }}
      align="start"
      variant="outlined"
      size="large"
      prefix={<WalletImage src={image} />}
      suffix={<State walletState={state} installLink={installLink} />}
    >
      <Typography variant="h5" noWrap={false}>
        {name}
      </Typography>
    </Button>
  );
}
