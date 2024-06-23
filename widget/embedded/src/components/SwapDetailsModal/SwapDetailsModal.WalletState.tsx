import type { WalletStateContentProps } from './SwapDetailsModal.types';
import type { DerivationPath, Namespace } from '@rango-dev/wallets-shared';

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
  providerType: string;
  providerImage: string;
  availableNamespaces?: Namespace[];
  singleNamespace?: boolean;
}

interface DerivationPathModalState {
  providerType: string;
  providerImage: string;
  namespace?: Namespace;
  derivationPaths?: DerivationPath[];
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

  const handleConfirmNamespaces = (namespaces: Namespace[]) => {
    if (!!walletInfo?.derivationPath && walletType) {
      setDerivationPathModalState({
        providerType: walletType,
        providerImage: walletInfo.img,
        namespace: namespaces[0],
        derivationPaths: walletInfo.derivationPath[namespaces[0]],
      });
    } else {
      connect({
        type: namespacesModalState?.providerType as string,
        namespaces,
      }).catch((error) => debug(error));
    }
    setNamespacesModalState(null);
  };

  const handleDerivationPathConfirm = (path: string) => {
    if (path && derivationPathModalState) {
      connect({
        type: derivationPathModalState?.providerType,
        namespaces: derivationPathModalState.namespace
          ? [derivationPathModalState.namespace]
          : undefined,
        derivationPath: path,
      }).catch((error) => debug(error));
    }

    setDerivationPathModalState(null);
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
                  providerType: walletType,
                  providerImage: walletInfo.img,
                  availableNamespaces: walletInfo.namespaces,
                  singleNamespace: walletInfo.singleNamespace,
                });
              } else {
                connect({ type: walletType }).catch((error) => debug(error));
              }
            }}
          />
        </WalletContainer>
      )}
      <WalletNamespacesModal
        open={!!namespacesModalState}
        onClose={() => setNamespacesModalState(null)}
        onConfirm={handleConfirmNamespaces}
        image={namespacesModalState?.providerImage}
        namespaces={namespacesModalState?.availableNamespaces}
        singleNamespace={namespacesModalState?.singleNamespace}
      />
      <WalletDerivationPathModal
        open={!!derivationPathModalState?.derivationPaths}
        type={derivationPathModalState?.providerType}
        image={derivationPathModalState?.providerImage}
        derivationPaths={derivationPathModalState?.derivationPaths}
        onClose={() => setDerivationPathModalState(null)}
        onConfirm={handleDerivationPathConfirm}
      />
    </>
  );
};
