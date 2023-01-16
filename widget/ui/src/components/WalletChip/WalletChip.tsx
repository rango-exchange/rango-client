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
    width: '1.5rem',
    height: '1.5rem',
    marginRight: '$3',
  },
});

const StateIconContainer = styled('span', {
  width: '24px',
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
        ? { isSelected: state === WalletState.CONNECTED }
        : { isDisabled: true })}
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
            {state === WalletState.NOT_INSTALLED && <Download size={23} />}
            {state === WalletState.CONNECTING && <Spinner />}
            {state === WalletState.CONNECTED && <FilledCircle size={8} />}
          </StateIconContainer>
        )}
      </Container>
    </ListItem>
  );
}

export default WalletChip;
