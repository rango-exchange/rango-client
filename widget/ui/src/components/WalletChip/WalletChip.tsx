import React from 'react';

import { styled } from '../../theme';
import { WalletInfo, WalletState } from '../../types/wallet';
import { Download, FilledCircle } from '../Icon';
import ListItem from '../ListItem';
import Spinner from '../Spinner';
import Typography from '../Typography';

const Container = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
});

const WalletDetails = styled('div', {
  display: 'flex',
  alignItems: 'center',
  '& img': {
    width: '$24',
    height: '$24',
    marginRight: '$12',
  },
});

const StateIconContainer = styled('span', {
  width: '$28',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export type PropTypes = WalletInfo & { onClick: (walletName: string) => void };

function WalletChip(props: PropTypes) {
  const { name, image, state, onClick } = props;
  return (
    <ListItem
      {...(state
        ? { selected: state === WalletState.CONNECTED }
        : { disabled: true })}
      onClick={onClick.bind(null, name)}
    >
      <Container>
        <WalletDetails>
          <img src={image} />
          <Typography variant="h5" noWrap={false}>
            {name}
          </Typography>
        </WalletDetails>
        {state !== WalletState.DISCONNECTED && (
          <StateIconContainer>
            {state === WalletState.NOT_INSTALLED && (
              <Download size={24} color="success" />
            )}
            {state === WalletState.CONNECTING && <Spinner />}
            {state === WalletState.CONNECTED && <FilledCircle size={16} />}
          </StateIconContainer>
        )}
      </Container>
    </ListItem>
  );
}

export default WalletChip;
