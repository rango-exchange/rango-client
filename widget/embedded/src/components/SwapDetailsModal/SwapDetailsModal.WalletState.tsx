import type { WalletStateContentProps } from './SwapDetailsModal.types';
import type { WalletInfoWithExtra } from '../../types';

import { warn } from '@rango-dev/logging-core';
import { MessageBox, Wallet } from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-react';
import React, { useState } from 'react';

import { useWalletList } from '../../hooks/useWalletList';
import { getContainer } from '../../utils/common';
import { mapStatusToWalletState } from '../../utils/wallets';
import { StatefulConnectModal } from '../StatefulConnectModal';

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
  const [selectedWalletToConnect, setSelectedWalletToConnect] =
    useState<WalletInfoWithExtra>();
  const { getWalletInfo, state } = useWallets();
  const walletType = currentStepWallet?.walletType;
  const walletState = walletType
    ? mapStatusToWalletState(state(walletType))
    : null;
  const walletInfo = walletType ? getWalletInfo(walletType) : null;
  const shouldShowWallet =
    showWalletButton && !!walletType && !!walletState && !!walletInfo;
  const { list } = useWalletList();

  const handleWalletItemClick = () => {
    if (!!walletType) {
      const wallet = list.find((wallet) => wallet.type === walletType);

      if (wallet) {
        setSelectedWalletToConnect(wallet);
      } else {
        warn(
          new Error(
            `It seems requested wallet to be connected is not available in the list. requested wallet: ${wallet}`
          )
        );
      }
    }
  };

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
            // TODO we need to show an error modal when user reject the connection
            onClick={handleWalletItemClick}
          />
        </WalletContainer>
      )}
      <StatefulConnectModal
        wallet={selectedWalletToConnect}
        onClose={() => {
          setSelectedWalletToConnect(undefined);
        }}
      />
    </>
  );
};
