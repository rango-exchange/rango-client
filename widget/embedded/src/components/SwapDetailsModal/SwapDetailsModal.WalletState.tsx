import type {
  NamespaceValue,
  WalletStateContentProps,
} from './SwapDetailsModal.types';

import { MessageBox, Wallet } from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-react';
import React, { useState } from 'react';

import { getContainer } from '../../utils/common';
import { mapStatusToWalletState } from '../../utils/wallets';
import { WalletNamespacesListModal } from '../WalletModal';

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
  const [openNamespacesModal, setOpenNamespacesModal] = useState<
    NamespaceValue | undefined
  >(undefined);

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
            onClick={() => {
              if (detachedInstances) {
                setOpenNamespacesModal({
                  providerId: walletType,
                  /*
                   * TODO: What i'm trying to here is connecting a namespace with no force to connect to a specific network.
                   * Code here works but it has implicit intentions.
                   */
                  namespaces: detachedInstances.value.map((namespace) => ({
                    namespace,
                    network: undefined,
                  })),
                });
              } else {
                void connect(walletType);
              }
            }}
          />
          <WalletNamespacesListModal
            open={!!openNamespacesModal}
            onClose={() => setOpenNamespacesModal(undefined)}
            onConfirm={(namespaces) => {
              console.log('user selected these:', { namespaces });
              if (openNamespacesModal) {
                void connect(openNamespacesModal.providerId, namespaces);
              }
              setOpenNamespacesModal(undefined);
            }}
            namespaces={openNamespacesModal?.namespaces || []}
          />
        </WalletContainer>
      )}
    </>
  );
};
