import React from 'react';

import { styled } from '../../theme';
import { WalletInfo, WalletState, WalletType } from '../../types/wallet';
import Button from '../Button/Button';
import Typography from '../Typography';
import State from './State';

const WalletImage = styled('img', {
  width: '$24',
  height: '$24',
  marginRight: '$12',
});

export type PropTypes = WalletInfo & { onClick: (walletType: WalletType) => void };

function Wallet(props: PropTypes) {
  const { name, type, image, state, onClick } = props;
  return (
    <Button
      type={state === WalletState.CONNECTED ? 'primary' : undefined}
      disabled={!state}
      onClick={onClick.bind(null, type)}
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

export default Wallet;
