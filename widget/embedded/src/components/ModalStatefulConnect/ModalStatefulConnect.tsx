import type { Result } from '../../hooks/useStatefulConnect';
import type { WalletInfoWithExtra } from '../../types';
import type { Namespace } from '@rango-dev/wallets-shared';

import { Divider } from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';

import { WIDGET_UI_ID } from '../../constants';
import {
  ResultStatus,
  useStatefulConnect,
} from '../../hooks/useStatefulConnect';
import { useWalletList } from '../../hooks/useWalletList';
import { WatermarkedModal } from '../common/WatermarkedModal';
import {
  ConnectStatus,
  DerivationPath,
  Namespaces,
} from '../WalletStatefulConnect';

interface PropTypes {
  wallet: WalletInfoWithExtra | undefined;
  onClose: () => void;
  // When `handleConnect` runs **successfully**, this will be called afterwards.
  onConnect?: (result: Result) => void;
}

export function ModalStatefulConnect(props: PropTypes) {
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

      const beforeConnecting = () => {
        setIsConnecting(true);
      };

      const afterConnected = (result: Result) => {
        if (
          [
            ResultStatus.Connected,
            ResultStatus.Disconnected,
            ResultStatus.DisconnectedUnhandled,
          ].includes(result.status)
        ) {
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

  const isOnStatus = getState().status === 'init' && !!props.wallet;
  const isOnNamespace = getState().status === 'namespace';
  const isOnDerivationPath = getState().status === 'derivationPath';

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
      container={
        document.getElementById(WIDGET_UI_ID.SWAP_BOX_ID) || document.body
      }>
      {isOnStatus ? (
        <>
          <ConnectStatus wallet={props.wallet!} error={error} />
          <Divider direction="vertical" size={32} />
        </>
      ) : null}
      {isOnNamespace && (
        <Namespaces
          onConfirm={handleConfirmNamespaces}
          value={getState().namespace!}
        />
      )}
      {isOnDerivationPath && (
        <DerivationPath
          onConfirm={handleDerivationPathConfirm}
          value={getState().derivationPath!}
        />
      )}
    </WatermarkedModal>
  );
}
