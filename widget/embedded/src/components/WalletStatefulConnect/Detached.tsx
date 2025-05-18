import type { PropTypes } from './Detached.types';

import { i18n } from '@lingui/core';
import { Divider, Image, MessageBox } from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-react';
import React, { useEffect } from 'react';

import { NamespaceDetachedItem } from './NamespaceDetachedItem';
import { NamespaceList, StyledButton } from './Namespaces.styles';
import { NamespaceUnsupportedItem } from './NamespaceUnsupportedItem';

export function Detached(props: PropTypes) {
  const { selectedNamespaces, value } = props;
  const { targetWallet } = value;
  const { connect } = useWallets();

  const initialConnect = async () => {
    // Filter selected namespaces that are supported by the target wallet
    const supportedNamespaces = targetWallet.needsNamespace?.data
      .filter(
        (namespace) =>
          !namespace.unsupported &&
          selectedNamespaces?.includes(namespace.value)
      )
      .map((namespace) => ({
        namespace: namespace.value,
        network: '',
      }));

    // Only attempt connection if there are supported namespaces
    if (supportedNamespaces?.length) {
      await connect(targetWallet.type, supportedNamespaces);
    }
  };
  useEffect(() => {
    void initialConnect();
  }, []);
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
      <Divider size={20} />
      <NamespaceList>
        {targetWallet.needsNamespace?.data.map((namespace, index, array) => (
          <React.Fragment key={namespace.id}>
            {namespace.unsupported ? (
              <NamespaceUnsupportedItem namespace={namespace} />
            ) : (
              <NamespaceDetachedItem
                walletType={targetWallet.type}
                namespace={namespace}
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
