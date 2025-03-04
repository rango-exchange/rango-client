import type { PropTypes } from './Detached.types';

import { i18n } from '@lingui/core';
import { Button, Divider, Image, MessageBox } from '@rango-dev/ui';
import React from 'react';

import { NamespaceDetachedItem } from './NamespaceDetachedItem';
import { NamespaceList } from './Namespaces.styles';

export function Detached(props: PropTypes) {
  const { targetWallet } = props.value;

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
            <NamespaceDetachedItem
              walletType={targetWallet.type}
              namespace={namespace}
            />
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
