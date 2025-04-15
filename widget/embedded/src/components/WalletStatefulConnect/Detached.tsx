import type { PropTypes } from './Detached.types';

import { i18n } from '@lingui/core';
import { Button, Divider, Image, MessageBox } from '@rango-dev/ui';
import React from 'react';

import { NamespaceDetachedItem } from './NamespaceDetachedItem';
import { NamespaceList } from './Namespaces.styles';
import { NamespaceUnsupportedItem } from './NamespaceUnsupportedItem';

export function Detached(props: PropTypes) {
  const { selectedNamespaces, value } = props;
  const { targetWallet } = value;

  return (
    <>
      <MessageBox
        type="info"
        title={i18n.t(`Connect {wallet}`, {
          wallet: targetWallet.type,
        })}
        description={i18n.t(
          "This wallet supports multiple chains. Choose which chains you'd like to connect to."
        )}
        icon={<Image src={targetWallet.image} size={45} />}
      />
      <NamespaceList>
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
      <Button
        id="widget-name-space-confirm-btn"
        type="primary"
        onClick={props.onConfirm}>
        {i18n.t('Done')}
      </Button>
    </>
  );
}
