import React from 'react';

import { styled } from '../../theme';
import { Download, Retry } from '../Icon';
import ListItem from '../ListItem';
import Spinner from '../Spinner';
import Typography from '../Typography';

const WalletDetails = styled('div', {
  display: 'flex',
  alignItems: 'center',
  '& img': {
    width: '1.5rem',
    height: '1.5rem',
    marginRight: '$3',
  },
});

export enum WalletState {
  NOT_INSTALLED = 'not installed',
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
}

export interface PropTypes {
  state: WalletState;
  isDisabled?: boolean;
  title: string;
  image: string;
}

function WalletChip(props: PropTypes) {
  const { title, image, state, isDisabled } = props;
  return (
    <ListItem
      {...(state
        ? { isSelected: state === WalletState.CONNECTED }
        : { isDisabled })}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <WalletDetails>
          <img src={image} />
          <Typography variant="h5" noWrap={false}>
            {title}
          </Typography>
        </WalletDetails>
        {state === WalletState.NOT_INSTALLED && (
          <Download size={23} color="#00A9BB" />
        )}
        {state === WalletState.CONNECTING && <Spinner />}
        {state === WalletState.CONNECTED && (
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="4" cy="4" r="4" fill="#5FA425" />
          </svg>
        )}
      </div>
    </ListItem>
  );
}

export default WalletChip;
