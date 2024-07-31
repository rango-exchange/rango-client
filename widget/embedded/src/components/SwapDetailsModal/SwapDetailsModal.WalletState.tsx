import type { WalletStateContentProps } from './SwapDetailsModal.types';
import type { Namespace } from '@rango-dev/wallets-shared';

import { debug, warn } from '@rango-dev/logging-core';
import { MessageBox, Wallet } from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-react';
import React from 'react';

import { useWalletList } from '../../hooks/useWalletList';
import { getContainer } from '../../utils/common';
import { mapStatusToWalletState } from '../../utils/wallets';
import {
  WalletDerivationPathModal,
  WalletNamespacesModal,
} from '../WalletStatefulConnect';
import { useStatefulConnect } from '../WalletStatefulConnect/useStatefulConnect';

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
  const { getWalletInfo, state } = useWallets();
  const walletType = currentStepWallet?.walletType;
  const walletState = walletType
    ? mapStatusToWalletState(state(walletType))
    : null;
  const walletInfo = walletType ? getWalletInfo(walletType) : null;
  const shouldShowWallet =
    showWalletButton && !!walletType && !!walletState && !!walletInfo;
  const {
    handleConnect,
    handleNamespace,
    handleDerivationPath,
    getState,
    resetState,
  } = useStatefulConnect();
  const { list } = useWalletList();

  const handleWalletItemClick = () => {
    if (!!walletType) {
      const wallet = list.find((wallet) => wallet.type === walletType);

      if (wallet) {
        void handleConnect(wallet);
      } else {
        warn(
          new Error(
            `It seems requested wallet to be connected is not available in the list. requested wallet: ${wallet}`
          )
        );
      }
    }
  };

  const handleConfirmNamespaces = (selectedNamespaces: Namespace[]) => {
    const wallet = list.find(
      (wallet) => wallet.type === getState().namespace?.providerType
    );

    if (wallet) {
      handleNamespace(wallet, selectedNamespaces).catch(debug);
    } else {
      warn(
        new Error(
          `It seems requested wallet to be connected is not available in the list. requested wallet: ${wallet}`
        )
      );
    }
  };

  const handleDerivationPathConfirm = (derivationPath: string) => {
    handleDerivationPath(derivationPath).catch(debug);
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
      <WalletNamespacesModal
        open={getState().status === 'namespace'}
        onClose={() => {
          resetState();
        }}
        onConfirm={handleConfirmNamespaces}
        image={getState().namespace?.providerImage}
        availableNamespaces={getState().namespace?.availableNamespaces}
        singleNamespace={getState().namespace?.singleNamespace}
      />
      <WalletDerivationPathModal
        open={getState().status === 'derivationPath'}
        onClose={() => {
          resetState('derivation');
        }}
        onConfirm={handleDerivationPathConfirm}
        selectedNamespace={getState().derivationPath?.namespace}
        type={getState().derivationPath?.providerType}
        image={getState().derivationPath?.providerImage}
      />
    </>
  );
};
