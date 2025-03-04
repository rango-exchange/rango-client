import type { NamespaceDetachedItemPropTypes } from './Namespaces.types';
import type { NamespaceData } from '@rango-dev/wallets-core/dist/hub/store/namespaces';

import { i18n } from '@lingui/core';
import { Button, Spinner, Typography } from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-react';
import React from 'react';

import { useAppStore } from '../../store/AppStore';

import { getBlockchainLogo } from './Namespaces.helpers';
import {
  NamespaceAccountAddress,
  NamespaceItemContainer,
  NamespaceItemContent,
  NamespaceLogo,
  NotSupportedNamespaceItemContent,
} from './Namespaces.styles';
import { SupportedChainsList } from './SupportedChainsList';

export function NamespaceDetachedItem(props: NamespaceDetachedItemPropTypes) {
  const { walletType, namespace } = props;
  const blockchains = useAppStore().blockchains();
  const { getNamespaceState, connectNamespace, disconnectNamespace } =
    useWallets();

  const handleButtonClick = async (state: NamespaceData) => {
    if (state.connected) {
      await disconnectNamespace(walletType, namespace.value);
    } else {
      await connectNamespace(walletType, {
        namespace: namespace.value,
        network: '',
      });
    }
  };

  if (namespace.notSupported) {
    return (
      <NamespaceItemContainer>
        <NamespaceLogo
          src={getBlockchainLogo(blockchains, namespace.id)}
          size={40}
          disabled
        />
        <NotSupportedNamespaceItemContent>
          <Typography variant="label" size="large">
            {namespace.label}
          </Typography>
          <Typography variant="body" size="xsmall">
            {i18n.t('(Currently not supported)')}
          </Typography>
        </NotSupportedNamespaceItemContent>
      </NamespaceItemContainer>
    );
  }
  const state = getNamespaceState(walletType, namespace.value);

  return (
    <NamespaceItemContainer>
      <NamespaceLogo
        src={getBlockchainLogo(blockchains, namespace.id)}
        size={40}
      />
      <NamespaceItemContent>
        <div style={{ display: 'flex', gap: '6px' }}>
          <Typography variant="label" size="large">
            {namespace.label}
          </Typography>
          {state.connected && (
            <Typography variant="label" size="large" color="success500">
              {i18n.t('Connected')}
            </Typography>
          )}
        </div>
        {state.connected && (
          <NamespaceAccountAddress variant="label" size="large">
            {state.accounts?.[0]}
          </NamespaceAccountAddress>
        )}
        {!state.connected && namespace.networks.length > 1 && (
          <SupportedChainsList chains={namespace.networks} />
        )}
      </NamespaceItemContent>
      {state.connecting ? (
        <Spinner color="info" />
      ) : (
        <Button
          id="widget-name-space-connect-btn"
          variant="ghost"
          type={state.connected ? 'error' : 'primary'}
          size="small"
          onClick={async () => handleButtonClick(state)}>
          {state.connected ? i18n.t('Disconnect') : i18n.t('Connect')}
        </Button>
      )}
    </NamespaceItemContainer>
  );
}
