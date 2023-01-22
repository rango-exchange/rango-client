import React, { Fragment } from 'react';
import { styled } from '../../theme';
import { FilledCircle } from '../common';
import { Download } from '../Icon';
import Spinner from '../Spinner';
import { WalletState } from '../../types/wallet';

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
  <Fragment>
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
  </Fragment>
);

export default State;
