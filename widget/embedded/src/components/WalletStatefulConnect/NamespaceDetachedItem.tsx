import type { NamespaceDetachedItemPropTypes } from './Namespaces.types';

import { i18n } from '@lingui/core';
import { Button, Spinner } from '@rango-dev/ui';
import React, { useLayoutEffect, useRef, useState } from 'react';

import { getConciseAddress } from '../../utils/wallets';
import { NamespaceItem } from '../NamespaceItem';

export function NamespaceDetachedItem(props: NamespaceDetachedItemPropTypes) {
  const {
    namespace,
    initialConnect,
    disabled,
    state,
    handleConnect,
    handleDisconnect,
  } = props;

  const [error, setError] = useState<Error | null>(null);

  /*
   * Ref to track ongoing connection attempts.
   * In React Strict Mode, effects run twice for safety checks.
   * This prevents multiple connect requests by ensuring only one attempt is processed at a time.
   */
  const processingConnectAttempt = useRef(false);

  useLayoutEffect(() => {
    if (initialConnect && !processingConnectAttempt.current) {
      void handleConnectNamespace(); // If we attempt to connect the namespace as the initial connect, we should not ask for derivation path
    }
  }, []);

  const handleConnectNamespace = async (options?: {
    shouldAskForDerivationPath?: boolean;
  }) => {
    try {
      processingConnectAttempt.current = true;
      await handleConnect(options);
    } catch (error) {
      setError(error as Error);
    } finally {
      processingConnectAttempt.current = false;
    }
  };

  const handleButtonClick = async () => {
    setError(null);
    if (state.connected) {
      await handleDisconnect();
    } else {
      void handleConnectNamespace({ shouldAskForDerivationPath: true }); // If we attempt to connect the namespace in result of button click, we should ask for derivation path
    }
  };

  const getConnectedAddress = () => {
    const firstAccountArray = state.accounts?.[0]?.split(':');
    const address = firstAccountArray?.[firstAccountArray.length - 1]; // Considering that account = [namespace, chain, address], we only need to get the address
    if (!state.connected || !address) {
      return null;
    }

    return getConciseAddress(address);
  };

  const getButtonText = () => {
    if (state.connected) {
      return i18n.t('Disconnect');
    }
    if (!!error) {
      return i18n.t('Try again');
    }
    return i18n.t('Connect');
  };

  return (
    <NamespaceItem
      namespace={namespace}
      connected={state.connected}
      error={error?.message}
      address={getConnectedAddress()}
      suffix={
        state.connecting ? (
          <Spinner color="info" />
        ) : (
          <Button
            id="widget-name-space-connect-btn"
            variant="ghost"
            type={state.connected ? 'error' : 'primary'}
            size="xsmall"
            onClick={async () => handleButtonClick()}
            disabled={disabled}>
            {getButtonText()}
          </Button>
        )
      }
    />
  );
}
