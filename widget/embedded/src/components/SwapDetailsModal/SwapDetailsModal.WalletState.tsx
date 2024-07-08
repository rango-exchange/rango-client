import type { WalletStateContentProps } from './SwapDetailsModal.types';
import type { Namespace } from '@rango-dev/wallets-shared';

import { debug } from '@rango-dev/logging-core';
import { MessageBox, Wallet } from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-react';
import React, { useState } from 'react';

import { getContainer } from '../../utils/common';
import { mapStatusToWalletState } from '../../utils/wallets';
import { WalletDerivationPathModal } from '../WalletDerivationPathModal';
import { WalletNamespacesModal } from '../WalletNamespacesModal';

import { WalletContainer } from './SwapDetailsModal.styles';

interface NamespacesModalState {
  open: boolean;
  providerType: string;
  providerImage: string;
  availableNamespaces?: Namespace[];
  singleNamespace?: boolean;
}

interface DerivationPathModalState {
  open: boolean;
  providerType: string;
  providerImage: string;
  namespace: Namespace;
}

export const WalletStateContent = (props: WalletStateContentProps) => {
  const {
    type,
    title,
    currentStepWallet,
    message,
    showWalletButton,
    walletButtonDisabled,
  } = props;
  const { connect, getWalletInfo, state } = useWallets();
  const [namespacesModalState, setNamespacesModalState] =
    useState<NamespacesModalState | null>(null);
  const [derivationPathModalState, setDerivationPathModalState] =
    useState<DerivationPathModalState | null>(null);
  const walletType = currentStepWallet?.walletType;
  const walletState = walletType
    ? mapStatusToWalletState(state(walletType))
    : null;
  const walletInfo = walletType ? getWalletInfo(walletType) : null;
  const shouldShowWallet =
    showWalletButton && !!walletType && !!walletState && !!walletInfo;

  const handleCloseNamespaceModal = () => {
    if (namespacesModalState) {
      setNamespacesModalState({
        ...namespacesModalState,
        open: false,
      });
    }
  };

  const handleCloseDerivationPathModal = () => {
    if (derivationPathModalState) {
      setDerivationPathModalState({
        ...derivationPathModalState,
        open: false,
      });
    }
  };

  const handleConfirmNamespaces = (selectedNamespaces: Namespace[]) => {
    if (
      !!walletInfo?.needsDerivationPath &&
      walletInfo?.singleNamespace &&
      selectedNamespaces[0] &&
      walletType
    ) {
      setDerivationPathModalState({
        open: true,
        providerType: walletType,
        providerImage: walletInfo.img,
        namespace: selectedNamespaces[0],
      });
    } else {
      connect(
        namespacesModalState?.providerType as string,
        undefined,
        selectedNamespaces.map((namespace) => ({
          namespace,
        }))
      ).catch((error) => debug(error));
    }
    handleCloseNamespaceModal();
  };

  const handleDerivationPathConfirm = (derivationPath: string) => {
    if (derivationPath && derivationPathModalState?.namespace) {
      connect(derivationPathModalState?.providerType, undefined, [
        { namespace: derivationPathModalState.namespace, derivationPath },
      ]).catch((error) => debug(error));
    }

    handleCloseDerivationPathModal();
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
            onClick={async () => {
              if (walletInfo.namespaces) {
                setNamespacesModalState({
                  open: true,
                  providerType: walletType,
                  providerImage: walletInfo.img,
                  availableNamespaces: walletInfo.namespaces,
                  singleNamespace: walletInfo.singleNamespace,
                });
              } else {
                connect(walletType).catch((error) => debug(error));
              }
            }}
          />
        </WalletContainer>
      )}
      <WalletNamespacesModal
        open={!!namespacesModalState?.open}
        onClose={handleCloseNamespaceModal}
        onConfirm={handleConfirmNamespaces}
        image={namespacesModalState?.providerImage}
        availableNamespaces={namespacesModalState?.availableNamespaces}
        singleNamespace={namespacesModalState?.singleNamespace}
      />
      <WalletDerivationPathModal
        open={!!derivationPathModalState?.open}
        selectedNamespace={derivationPathModalState?.namespace}
        type={derivationPathModalState?.providerType}
        image={derivationPathModalState?.providerImage}
        onClose={handleCloseDerivationPathModal}
        onConfirm={handleDerivationPathConfirm}
      />
    </>
  );
};
