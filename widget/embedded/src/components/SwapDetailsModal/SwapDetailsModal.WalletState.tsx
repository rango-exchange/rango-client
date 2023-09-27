import type { WalletStateContentProps } from './SwapDetailsModal.types';

import { MessageBox, Wallet, WalletState } from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-react';
import React from 'react';

import { WalletContainer } from './SwapDetailsModal.styles';

export const WalletStateContent = ({
  type,
  title,
  currentStepWallet,
  message,
}: WalletStateContentProps) => {
  const { connect, getWalletInfo, state: walletState } = useWallets();
  const walletType = currentStepWallet?.walletType;
  const isConnected = walletType && walletState(walletType).connected;
  const state = isConnected ? WalletState.CONNECTED : WalletState.DISCONNECTED;
  return (
    <>
      <MessageBox type={type} title={title} description={message} />
      {walletType && (
        <WalletContainer>
          <Wallet
            title={getWalletInfo(walletType).name}
            image={getWalletInfo(walletType).img}
            type={walletType}
            state={state}
            onClick={async () => connect(walletType)}
          />
        </WalletContainer>
      )}
    </>
  );
};