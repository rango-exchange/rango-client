import React from 'react';

import { styled } from '../../theme';
import { WalletInfo, WalletState } from '../../types/wallet';
import Button from '../Button/Button';
import { FilledCircle } from '../common';
import { Download } from '../Icon';
import Spinner from '../Spinner';
import Typography from '../Typography';

const WalletImage = styled('img', {
  width: '$24',
  height: '$24',
  marginRight: '$12',
});

const StateIconContainer = styled('span', {
  width: '$28',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const State = ({
  walletState,
  installLink,
}: {
  walletState: WalletState | undefined;
  installLink: string | undefined;
}) => (
  <>
    {walletState !== WalletState.DISCONNECTED && (
      <StateIconContainer>
        {walletState === WalletState.NOT_INSTALLED && (
          <a href={installLink}>
            <Download size={24} color="success" />
          </a>
        )}
        {walletState === WalletState.CONNECTING && <Spinner />}
        {walletState === WalletState.CONNECTED && <FilledCircle />}
      </StateIconContainer>
    )}
  </>
);

export type PropTypes = WalletInfo & { onClick: (walletName: string) => void };

function WalletChip(props: PropTypes) {
  const { name, image, state, onClick } = props;
  return (
    <Button
      type={state === WalletState.CONNECTED ? 'primary' : undefined}
      disabled={!state}
      onClick={onClick.bind(null, name)}
      align="start"
      variant="outlined"
      size="large"
      prefix={<WalletImage src={image} />}
      suffix={
        <State
          walletState={state}
          installLink={
            state === WalletState.NOT_INSTALLED ? props.installLink : undefined
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

export default WalletChip;
