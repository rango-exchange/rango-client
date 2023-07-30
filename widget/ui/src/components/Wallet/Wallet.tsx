import { detectInstallLink, WalletType } from '@rango-dev/wallets-shared';
import React from 'react';

import { styled } from '../../theme';
import { WalletInfo, WalletState } from '../../types/wallet';
import { Typography } from '../Typography';
import { Image } from '../common';
import { Tooltip } from '../Tooltip';

const WalletImageContainer = styled('div', {
  '& img': {
    borderRadius: '50%',
  },
});

const Text = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  marginTop: '$10',
});

const ExtendedButton = styled('button', {
  borderRadius: '$xm',
  padding: '$10',
  border: '0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '$secondary300',
    opacity: '0.8',
  },
  variants: {
    selected: {
      true: {
        borderWidth: 1,
        borderColor: '$secondary',
        borderStyle: 'solid',
      },
    },
  },
});

export type PropTypes = WalletInfo & {
  onClick: (walletType: WalletType) => void;
  selected?: boolean;
};

export function Wallet(props: PropTypes) {
  const {
    name,
    type,
    image,
    state,
    onClick,
    installLink,
    selected = false,
  } = props;
  const status =
    state === WalletState.CONNECTED
      ? { color: 'success', title: 'Connected', toolTip: 'Disconnect' }
      : state === WalletState.NOT_INSTALLED
      ? { color: 'link', title: 'Install', toolTip: 'install' }
      : { color: 'neutral400', title: 'Disconnected', toolTip: 'Connect' };
  return (
    <Tooltip content={status.toolTip} side="bottom">
      <ExtendedButton
        disabled={state == WalletState.CONNECTING}
        selected={selected}
        onClick={() => {
          if (state === WalletState.NOT_INSTALLED) {
            window.open(detectInstallLink(installLink), '_blank');
          } else onClick(type);
        }}>
        <WalletImageContainer>
          <Image src={image} size={35} />
        </WalletImageContainer>

        <Text>
          <Typography variant="label" size="medium" noWrap={false}>
            {name}
          </Typography>

          <Typography
            variant="body"
            size="xsmall"
            noWrap={false}
            color={status.color}>
            {status.title}
          </Typography>
        </Text>
      </ExtendedButton>
    </Tooltip>
  );
}
