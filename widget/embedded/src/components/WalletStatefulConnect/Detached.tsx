import type { PropTypes } from './Detached.types';

import { i18n } from '@lingui/core';
import {
  Button,
  Divider,
  Image,
  MessageBox,
  WalletImageContainer,
} from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-react';
import React from 'react';

import { NamespaceUnsupportedItem } from '../NamespaceItem/NamespaceUnsupportedItem';

import { NamespacesHeader } from './Detached.styles';
import { NamespaceDetachedItem } from './NamespaceDetachedItem';
import { NamespaceList, StyledButton } from './Namespaces.styles';

export function Detached(props: PropTypes) {
  const { selectedNamespaces, value, onDisconnectWallet } = props;
  const { targetWallet } = value;

  const { state } = useWallets();
  const walletState = state(targetWallet.type);

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
        icon={
          <WalletImageContainer>
            <Image src={targetWallet.image} size={45} />
          </WalletImageContainer>
        }
      />
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
      <NamespaceList id="widget-detached-namespace-list" as={'ul'}>
        {targetWallet.needsNamespace?.data.map((namespace, index, array) => (
          <React.Fragment key={namespace.id}>
            {namespace.unsupported ? (
              <NamespaceUnsupportedItem namespace={namespace} />
            ) : (
              <NamespaceDetachedItem
                walletType={targetWallet.type}
                namespace={namespace}
                initialConnect={selectedNamespaces?.includes(namespace.value)}
              />
            )}
            {index !== array.length - 1 && <Divider size={10} />}
          </React.Fragment>
        ))}
      </NamespaceList>
      <Divider size={20} />
      <StyledButton
        id="widget-name-space-confirm-btn"
        type="primary"
        onClick={props.onConfirm}>
        {i18n.t('Done')}
      </StyledButton>
    </>
  );
}
