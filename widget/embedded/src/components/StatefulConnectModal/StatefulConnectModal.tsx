import type { Result } from '../../hooks/useStatefulConnect';
import type { WalletInfoWithExtra } from '../../types';
import type { Namespace } from '@rango-dev/wallets-shared';

import { Divider } from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';

import {
  ResultStatus,
  useStatefulConnect,
} from '../../hooks/useStatefulConnect';
import { useWalletList } from '../../hooks/useWalletList';
import { getContainer } from '../../utils/common';
import { WatermarkedModal } from '../common/WatermarkedModal';
import {
  ConnectStatus,
  DerivationPath,
  Namespaces,
} from '../WalletStatefulConnect';

import { isOnDerivationPath, isOnNamespace, isOnStatus } from './helpers';

const KEEP_SUCCESS_MODAL_FOR = 3_000;
const DELAY_SHOWING_MODAL_FOR = 300;

interface PropTypes {
  wallet: WalletInfoWithExtra | undefined;
  onClose: () => void;
  // When `handleConnect` runs **successfully**, this will be called afterwards.
  onConnect?: (result: Result) => void;
}

export function StatefulConnectModal(props: PropTypes) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>();
  const catchErrorOnHandle = (error: Error) => {
    setError(error.message);
  };
  const { terminateConnectingWallets } = useWalletList();

  const {
    handleConnect,
    handleDerivationPath,
    handleNamespace,
    getState,
    resetState,
  } = useStatefulConnect();

  const handleConfirmNamespaces = (selectedNamespaces: Namespace[]) => {
    handleNamespace(props.wallet!, selectedNamespaces).catch(
      catchErrorOnHandle
    );
  };

  const handleDerivationPathConfirm = (derivationPath: string) => {
    if (!derivationPath) {
      throw new Error(
        "Derivation path is empty. Please make sure you've filled the field correctly."
      );
    }

    handleDerivationPath(derivationPath).catch(catchErrorOnHandle);
  };

  const handleClosingModal = () => {
    setIsConnecting(false);
  };

  const resetModalState = () => {
    setError(undefined);
    resetState();
    setIsConnecting(false);
  };

  useEffect(() => {
    if (props.wallet) {
      resetModalState();
      let isConnected = false;
      /*
       * If connecting to wallet is happening quickly, we shouldn't show a modal.
       * by default we are assuming we can connect quickly, but if it passes an certain amount of time
       * We set his flag as false which means we a modal has been opened (showing a connection status or Namespace/Derivation path modal)
       */
      let isImmediatelyConnected = true;

      const beforeConnecting = () => {
        setTimeout(() => {
          isImmediatelyConnected = false;
          if (!isConnected) {
            setIsConnecting(true);
          }
        }, DELAY_SHOWING_MODAL_FOR);
      };

      const afterConnected = (result: Result) => {
        const resultIsConnected = result.status === ResultStatus.Connected;
        const resultIsDisconnected = [
          ResultStatus.Disconnected,
          ResultStatus.DisconnectedUnhandled,
        ].includes(result.status);
        const resultIsNeedMoreStepsToConnect = [
          ResultStatus.Namespace,
          ResultStatus.DerivationPath,
        ].includes(result.status);

        if (!resultIsNeedMoreStepsToConnect) {
          isConnected = true;
        }

        if (resultIsConnected && !isImmediatelyConnected) {
          setTimeout(handleClosingModal, KEEP_SUCCESS_MODAL_FOR);
        } else if (resultIsDisconnected) {
          handleClosingModal();
        }

        if (props.onConnect) {
          props.onConnect(result);
        }
      };

      beforeConnecting();
      handleConnect(props.wallet, {
        disconnectIfConnected: true,
      })
        .then(afterConnected)
        .catch(catchErrorOnHandle);
    }
  }, [props.wallet]);

  return (
    <WatermarkedModal
      open={isConnecting}
      onClose={handleClosingModal}
      onExit={() => {
        resetModalState();
        terminateConnectingWallets();
        if (props.onClose) {
          props.onClose();
        }
      }}
      container={getContainer()}>
      {isOnStatus(getState, props.wallet) && (
        <>
          <ConnectStatus
            wallet={{
              type: props.wallet.type,
              image: props.wallet.image,
            }}
            error={error}
          />
          <Divider direction="vertical" size={32} />
        </>
      )}
      {isOnNamespace(getState) && (
        <Namespaces
          onConfirm={handleConfirmNamespaces}
          value={getState().namespace}
        />
      )}
      {isOnDerivationPath(getState) && (
        <DerivationPath
          onConfirm={handleDerivationPathConfirm}
          value={getState().derivationPath}
        />
      )}
    </WatermarkedModal>
  );
}
