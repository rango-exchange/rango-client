import type { PropTypes } from './Detached.types';
import type { LegacyNamespaceMeta } from '@rango-dev/wallets-core/legacy';
import type { Namespace } from '@rango-dev/wallets-core/namespaces/common';

import { i18n } from '@lingui/core';
import { Alert, Button, Divider, Image, MessageBox } from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-react';
import React from 'react';

import { NamespaceUnsupportedItem } from '../NamespaceItem/NamespaceUnsupportedItem';

import { NamespacesHeader } from './Detached.styles';
import { NamespaceDetachedItem } from './NamespaceDetachedItem';
import { NamespaceList, StyledButton } from './Namespaces.styles';

export function Detached(props: PropTypes) {
  const {
    value,
    selectedNamespaces,
    onConfirm,
    onDisconnectWallet,
    navigateToDerivationPath,
  } = props;
  const { targetWallet } = value;

  const { connect, disconnect, state } = useWallets();
  const walletType = targetWallet.type;
  const walletState = state(walletType);
  const namespacesProperty = targetWallet.properties?.find(
    (property) => property.name === 'namespaces'
  );
  const derivationPathProperty = targetWallet.properties?.find(
    (property) => property.name === 'derivationPath'
  );

  const singleSelection = namespacesProperty?.value.selection === 'single';

  const handleConnectNamespace = async (
    namespace: Namespace,
    options?: {
      derivationPath?: string;
      shouldAskForDerivationPath?: boolean;
    }
  ) => {
    if (singleSelection) {
      // For single-selection wallets, disconnect all namespaces before connecting a new namespace
      await disconnect(walletType);
    }
    if (derivationPathProperty && options?.shouldAskForDerivationPath) {
      navigateToDerivationPath(namespace);
    } else {
      await connect(walletType, [
        {
          namespace: namespace,
          network: '',
          derivationPath: options?.derivationPath ?? undefined,
        },
      ]);
    }
  };

  const handleDisconnectNamespace = async (namespace: Namespace) => {
    await disconnect(walletType, [namespace]);
  };

  const renderNamespaceListHeader = () => {
    if (!!singleSelection) {
      return (
        <>
          <Divider size={20} />
          <Alert
            id="widget-wallet-stateful-connect-alert"
            variant="alarm"
            type="info"
            title={i18n.t(
              'This wallet can only connect to one chain at a time.'
            )}
          />
          <Divider size={30} />
        </>
      );
    }
    return (
      <>
        <Divider size={30} />
        <NamespacesHeader>
          <Button
            id="widget-detached-disconnect-wallet-btn"
            variant="ghost"
            type="error"
            size="xsmall"
            disabled={walletState.connecting || !walletState.connected}
            onClick={onDisconnectWallet}>
            {i18n.t('Disconnect wallet')}
          </Button>
        </NamespacesHeader>
        <Divider size={16} />
      </>
    );
  };

  const renderNamespaceItem = (namespace: LegacyNamespaceMeta) => {
    if (namespace.unsupported) {
      return <NamespaceUnsupportedItem namespace={namespace} />;
    }

    const selectedNamespace = selectedNamespaces?.find(
      (selectedNamespaceItem) =>
        selectedNamespaceItem.namespace === namespace.value
    );

    const namespaceState = walletState.namespaces?.get(namespace.value);

    if (!namespaceState) {
      throw new Error(`State for ${namespace.value} was not found!`);
    }

    const disabled = singleSelection && walletState.connecting; // If wallet is configured as single selection, button should be disabled while a namespace is already in connecting state

    return (
      <NamespaceDetachedItem
        namespace={namespace}
        initialConnect={!!selectedNamespace}
        disabled={disabled}
        state={namespaceState}
        handleConnect={async (options) =>
          handleConnectNamespace(namespace.value, {
            derivationPath: selectedNamespace?.derivationPath,
            shouldAskForDerivationPath: options?.shouldAskForDerivationPath,
          })
        }
        handleDisconnect={async () =>
          handleDisconnectNamespace(namespace.value)
        }
      />
    );
  };

  return (
    <>
      <MessageBox
        type="info"
        title={i18n.t(`Connect {wallet}`, {
          wallet: targetWallet.type,
        })}
        description={i18n.t(
          'This wallet supports multiple chains. Choose which chains you’d like to connect or disconnect.'
        )}
        icon={<Image src={targetWallet.image} size={45} />}
      />
      {renderNamespaceListHeader()}
      <NamespaceList id="widget-detached-namespace-list">
        {targetWallet.needsNamespace?.data.map((namespace, index, array) => (
          <React.Fragment key={namespace.id}>
            {renderNamespaceItem(namespace)}
            {index !== array.length - 1 && <Divider size={10} />}
          </React.Fragment>
        ))}
      </NamespaceList>
      <Divider size={20} />
      <StyledButton
        id="widget-name-space-confirm-btn"
        type="primary"
        onClick={onConfirm}>
        {i18n.t('Done')}
      </StyledButton>
    </>
  );
}
