import React from 'react';

import { styled } from '../../theme';
import { WalletInfo, WalletState } from '../../types/wallet';
import Button from '../Button/Button';
import { Download } from '../Icon';
import ListItem from '../ListItem';
import Spinner from '../Spinner';
import Typography from '../Typography';

const Container = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
});

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

const FilledCircle = styled('span', {
  width: '10px',
  height: '10px',
  backgroundColor: '$primary500',
  borderRadius: '99999px',
});

export type PropTypes = WalletInfo & { onClick: (walletName: string) => void };

function WalletChip(props: PropTypes) {
  const { name, image, state, onClick } = props;
  return (
    <Button
      {...(state
        ? { type: state === WalletState.CONNECTED ? 'primary' : undefined }
        : { disabled: true })}
      onClick={onClick.bind(null, name)}
      align="start"
      variant="outlined"
      size="large"
      prefix={<WalletImage src={image} />}
      suffix={
        state !== WalletState.DISCONNECTED && (
          <StateIconContainer>
            {state === WalletState.NOT_INSTALLED && (
              <Download size={24} color="success" />
            )}
            {state === WalletState.CONNECTING && <Spinner />}
            {state === WalletState.CONNECTED && <FilledCircle />}
          </StateIconContainer>
        )
      }
    >
      <Typography variant="h5" noWrap={false}>
        {name}
      </Typography>
    </Button>
  );
}

export default WalletChip;
