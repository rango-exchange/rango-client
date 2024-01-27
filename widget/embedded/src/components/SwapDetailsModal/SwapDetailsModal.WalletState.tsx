import type { WalletStateContentProps } from './SwapDetailsModal.types';

import { MessageBox, Wallet, WalletState } from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-react';
import React, { useEffect, useRef } from 'react';

import { getContainer } from '../../utils/common';
import { mapStatusToWalletState } from '../../utils/wallets';

import { WalletContainer } from './SwapDetailsModal.styles';

export const WalletStateContent = (props: WalletStateContentProps) => {
  const {
    type,
    title,
    currentStepWallet,
    message,
    showWalletButton,
    walletButtonDisabled,
  } = props;
  const { connect, getWalletInfo, state, disconnect } = useWallets();
  const walletType = currentStepWallet?.walletType;
  const walletState = walletType
    ? mapStatusToWalletState(state(walletType))
    : null;
  const componentWillUnmount = useRef(false);

  const walletInfo = walletType ? getWalletInfo(walletType) : null;
  const shouldShowWallet =
    showWalletButton && !!walletType && !!walletState && !!walletInfo;

  /*
   * The order of useEffects is crucial.
   * 1- The first useEffect for componentWillUnmount sets its value to true
   */
  useEffect(() => {
    return () => {
      componentWillUnmount.current = true;
    };
  }, []);

  // 2- The second useEffect checks if componentWillUnmount is true then it disconnects connecting wallet
  useEffect(() => {
    return () => {
      if (
        componentWillUnmount.current &&
        walletType &&
        walletState === WalletState.CONNECTING
      ) {
        void disconnect(walletType);
      }
    };
  }, [walletState]);

  return (
    <>
      <MessageBox type={type} title={title} description={message} />
      {shouldShowWallet && (
        <WalletContainer>
          <Wallet
            container={getContainer()}
            title={walletInfo.name}
            image={walletInfo.img}
            type={walletType}
            state={walletState}
            link={walletInfo.installLink}
            disabled={walletButtonDisabled}
            onClick={async () => connect(walletType)}
          />
        </WalletContainer>
      )}
    </>
  );
};
