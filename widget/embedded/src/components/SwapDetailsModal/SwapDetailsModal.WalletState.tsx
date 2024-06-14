import type { WalletStateContentProps } from './SwapDetailsModal.types';
import type { NamespacesModalState } from '../../pages/WalletsPage';

import { debug } from '@rango-dev/logging-core';
import { MessageBox, Wallet } from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-react';
import React, { useState } from 'react';

import { getContainer } from '../../utils/common';
import { mapStatusToWalletState } from '../../utils/wallets';
import { WalletNamespacesModal } from '../WalletNamespacesModal';

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
  const { connect, getWalletInfo, state } = useWallets();
  const [namespacesModalState, setNamespacesModalState] =
    useState<NamespacesModalState | null>(null);
  const walletType = currentStepWallet?.walletType;
  const walletState = walletType
    ? mapStatusToWalletState(state(walletType))
    : null;
  const walletInfo = walletType ? getWalletInfo(walletType) : null;
  const shouldShowWallet =
    showWalletButton && !!walletType && !!walletState && !!walletInfo;
  const detachedInstances = walletInfo?.properties?.find(
    (item) => item.name === 'detached'
  );

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
            onClick={async () => {
              const legacyCondition = !!walletInfo.namespaces;
              const hubCondition = !!detachedInstances;

              if (hubCondition || legacyCondition) {
                const isHub = !!walletInfo.properties;

                const availableNamespaces = isHub
                  ? detachedInstances?.value
                  : walletInfo.namespaces;

                setNamespacesModalState({
                  providerType: walletType,
                  providerImage: walletInfo.img,
                  availableNamespaces,
                  singleNamespace: walletInfo.singleNamespace,
                });
              } else {
                void connect(walletType).catch((error) => debug(error));
              }
            }}
          />
          <WalletNamespacesModal
            open={!!namespacesModalState}
            onClose={() => setNamespacesModalState(null)}
            onConfirm={(namespaces) => {
              console.log('user selected these:', { namespaces });
              if (namespacesModalState) {
                void connect(
                  namespacesModalState.providerType,
                  namespaces.map((ns) => ({
                    namespace: ns,
                    network: undefined,
                  }))
                ).catch((error) => debug(error));
              }
              setNamespacesModalState(null);
            }}
            image={namespacesModalState?.providerImage}
            namespaces={namespacesModalState?.availableNamespaces}
            singleNamespace={namespacesModalState?.singleNamespace}
          />
        </WalletContainer>
      )}
    </>
  );
};
