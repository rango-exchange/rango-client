import type { NamespaceDetachedItemPropTypes } from './Namespaces.types';
import type { NamespaceData } from '@rango-dev/wallets-core/dist/hub/store/namespaces';
import type { Namespace } from '@rango-dev/wallets-core/namespaces/common';

import { i18n } from '@lingui/core';
import {
  Button,
  ChevronDownIcon,
  ChevronUpIcon,
  Divider,
  Spinner,
  Typography,
} from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-react';
import React, { useEffect, useLayoutEffect, useState } from 'react';

import { useAppStore } from '../../store/AppStore';
import { getConciseAddress } from '../../utils/wallets';

import { getBlockchainLogo } from './Namespaces.helpers';
import {
  NamespaceAccountAddress,
  NamespaceDetachedItemInfo,
  NamespaceItemContainer,
  NamespaceItemContent,
  NamespaceItemError,
  NamespaceItemErrorDropdownToggle,
  NamespaceItemInnerContent,
  NamespaceLogo,
} from './Namespaces.styles';
import { SupportedChainsList } from './SupportedChainsList';

export const NamespaceDetachedItem = function NamespaceDetachedItem(
  props: NamespaceDetachedItemPropTypes
) {
  const {
    targetWallet,
    namespace,
    initialConnect,
    navigateToDerivationPath,
    derivationPath,
    singleSelection,
  } = props;
  const blockchains = useAppStore().blockchains();
  const { connect, disconnect, state } = useWallets();
  const [error, setError] = useState<Error | null>(null);
  const [errorIsExpanded, setErrorIsExpanded] = useState(false);

  const walletType = targetWallet.type;
  const walletState = state(walletType);

  const namespacesPathProperty = targetWallet.properties?.find(
    (property) => property.name === 'namespaces'
  );
  const derivationPathProperty = targetWallet.properties?.find(
    (property) => property.name === 'derivationPath'
  );

  const namespaceState = walletState.namespaces?.get(namespace.value);
  const firstAccountArray = namespaceState.accounts?.[0]?.split(':');

  const supportedChains = namespace.getSupportedChains(blockchains);

  useEffect(() => setErrorIsExpanded(false), [error]);

  useLayoutEffect(() => {
    if (initialConnect) {
      void handleConnectNamespace(walletType, namespace.value);
    }
  }, []);

  const handleConnectNamespace = async (
    walletType: string,
    namespace: Namespace
  ) => {
    if (singleSelection) {
      await disconnect(
        walletType,
        namespacesPathProperty?.value.data.map((namespace) => namespace.value)
      );
    }
    try {
      await connect(walletType, [
        {
          namespace: namespace,
          network: '',
          derivationPath: derivationPath ?? undefined,
        },
      ]);
    } catch (error) {
      setError(error as Error);
    }
  };

  const handleButtonClick = async (namespaceState: NamespaceData) => {
    setError(null);
    if (namespaceState.connected) {
      await disconnect(walletType, [namespace.value]);
    } else {
      if (derivationPathProperty) {
        navigateToDerivationPath();
      } else {
        void handleConnectNamespace(walletType, namespace.value);
      }
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
    <NamespaceItemContainer hasError={!!error}>
      <NamespaceItemContent>
        <NamespaceLogo
          src={getBlockchainLogo(blockchains, namespace.id)}
          size={40}
        />
        <NamespaceItemInnerContent>
          <NamespaceDetachedItemInfo className="widget-namespace-detached-item-info-div">
            <Typography variant="label" size="large">
              {namespace.label}
            </Typography>
            {namespaceState.connected && (
              <Typography variant="body" size="small" color="success500">
                {i18n.t('Connected')}
              </Typography>
            )}
            {!namespaceState.connected && !!error && (
              <Typography variant="body" size="small" color="error500">
                {i18n.t('Connection failed')}
              </Typography>
            )}
          </NamespaceDetachedItemInfo>
          {namespaceState.connected && (
            <NamespaceAccountAddress
              variant="body"
              size="small"
              color="neutral700">
              {getConciseAddress(
                firstAccountArray?.[firstAccountArray?.length - 1]
              )}
            </NamespaceAccountAddress>
          )}
          {!namespaceState.connected && error && (
            <NamespaceItemErrorDropdownToggle
              className="widget-namespace-detached-item-error-toggle-btn"
              onClick={() =>
                setErrorIsExpanded((errorIsExpanded) => !errorIsExpanded)
              }>
              <Typography
                variant="body"
                size="small"
                color="neutral700"
                style={{
                  textDecoration: 'underline',
                  userSelect: 'none',
                  textDecorationSkipInk: 'none',
                }}>
                {i18n.t('See why')}
              </Typography>
              {errorIsExpanded ? (
                <ChevronUpIcon size={12} color="gray" />
              ) : (
                <ChevronDownIcon size={12} color="gray" />
              )}
            </NamespaceItemErrorDropdownToggle>
          )}
          {!namespaceState.connected &&
            !error &&
            supportedChains.length > 1 && (
              <SupportedChainsList chains={supportedChains} />
            )}
        </NamespaceItemInnerContent>
        {namespaceState.connecting ? (
          <Spinner color="info" />
        ) : (
          <Button
            id="widget-name-space-connect-btn"
            variant="ghost"
            type={namespaceState.connected ? 'error' : 'primary'}
            size="small"
            onClick={async () => handleButtonClick(namespaceState)}>
            {getButtonText()}
          </Button>
        )}
      </NamespaceItemContent>
      {!namespaceState.connected && !!error && errorIsExpanded && (
        <>
          <Divider size={4} />
          <NamespaceItemError id="widget-namespace-item-error-div">
            <Typography variant="body" size="small" color="neutral700">
              {(error.cause as Error)?.message || error.message}
            </Typography>
          </NamespaceItemError>
        </>
      )}
    </NamespaceItemContainer>
  );
};
