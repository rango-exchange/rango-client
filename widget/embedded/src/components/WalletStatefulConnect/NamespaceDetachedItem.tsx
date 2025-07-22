import type { NamespaceDetachedItemPropTypes } from './Namespaces.types';
import type { NamespaceData } from '@arlert-dev/wallets-core/dist/hub/store/namespaces';
import type { Namespace } from '@arlert-dev/wallets-core/namespaces/common';

import { i18n } from '@lingui/core';
import { Button, Spinner } from '@arlert-dev/ui';
import { useWallets } from '@arlert-dev/wallets-react';
import React, { useLayoutEffect, useRef, useState } from 'react';

import { getConciseAddress } from '../../utils/wallets';
import { NamespaceItem } from '../NamespaceItem';

export const NamespaceDetachedItem = function NamespaceDetachedItem(
  props: NamespaceDetachedItemPropTypes
) {
  const { walletType, namespace, initialConnect } = props;
  const { connect, disconnect, state } = useWallets();
  const [error, setError] = useState<Error | null>(null);

  const walletState = state(walletType);

  const namespaceState = walletState.namespaces?.get(namespace.value);
  const firstAccountArray = namespaceState.accounts?.[0]?.split(':');

  /*
   * Ref to track ongoing connection attempts.
   * In React Strict Mode, effects run twice for safety checks.
   * This prevents multiple connect requests by ensuring only one attempt is processed at a time.
   */
  const processingConnectAttempt = useRef(false);

  useLayoutEffect(() => {
    if (initialConnect && !processingConnectAttempt.current) {
      void handleConnectNamespace(walletType, namespace.value);
    }
  }, []);

  const handleConnectNamespace = async (
    walletType: string,
    namespace: Namespace
  ) => {
    try {
      processingConnectAttempt.current = true;
      await connect(walletType, [
        {
          namespace: namespace,
          network: '',
        },
      ]);
    } catch (error) {
      setError(error as Error);
    } finally {
      processingConnectAttempt.current = false;
    }
  };

  const handleButtonClick = async (namespaceState: NamespaceData) => {
    setError(null);
    if (namespaceState.connected) {
      await disconnect(walletType, [namespace.value]);
    } else {
      void handleConnectNamespace(walletType, namespace.value);
    }
  };

  const getButtonText = () => {
    if (namespaceState.connected) {
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
      connected={namespaceState.connected}
      error={error?.message}
      address={
        namespaceState.connected
          ? getConciseAddress(
              firstAccountArray?.[firstAccountArray?.length - 1]
            )
          : ''
      }
      suffix={
        namespaceState.connecting ? (
          <Spinner color="info" />
        ) : (
          <Button
            id="widget-name-space-connect-btn"
            variant="ghost"
            type={namespaceState.connected ? 'error' : 'primary'}
            size="xsmall"
            onClick={async () => handleButtonClick(namespaceState)}>
            {getButtonText()}
          </Button>
        )
      }
    />
  );
};
