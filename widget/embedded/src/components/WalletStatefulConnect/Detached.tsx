import type { PropTypes } from './Detached.types';
import type { NamespaceMeta } from '@rango-dev/wallets-core/dist/legacy/types';

import { i18n } from '@lingui/core';
import { Alert, Divider, Image, MessageBox } from '@rango-dev/ui';
import React, { useMemo } from 'react';

import { NamespaceDetachedItem } from './NamespaceDetachedItem';
import { NamespaceList, StyledButton } from './Namespaces.styles';
import { NamespaceUnsupportedItem } from './NamespaceUnsupportedItem';

interface NamespaceItemProps {
  namespace: NamespaceMeta;
  targetWallet: PropTypes['value']['targetWallet'];
  singleSelection: boolean;
  selectedNamespaces?: PropTypes['selectedNamespaces'];
  navigateToDerivationPath: (namespace: string) => void;
}

const NamespaceItem = React.memo(
  ({
    namespace,
    targetWallet,
    singleSelection,
    selectedNamespaces,
    navigateToDerivationPath,
  }: NamespaceItemProps) => {
    if (namespace.unsupported) {
      return <NamespaceUnsupportedItem namespace={namespace} />;
    }

    const selectedNamespace = selectedNamespaces?.find(
      (selectedNamespaceItem) =>
        selectedNamespaceItem.namespace === namespace.value
    );

    return (
      <NamespaceDetachedItem
        targetWallet={targetWallet}
        namespace={namespace}
        singleSelection={singleSelection}
        navigateToDerivationPath={() =>
          navigateToDerivationPath(namespace.value)
        }
        initialConnect={!!selectedNamespace}
        derivationPath={selectedNamespace?.derivationPath}
      />
    );
  }
);

NamespaceItem.displayName = 'NamespaceItem';

export function Detached(props: PropTypes) {
  const { value, selectedNamespaces, navigateToDerivationPath } = props;
  const { targetWallet } = value;

  const namespacesProperty = useMemo(
    () =>
      targetWallet.properties?.find(
        (property) => property.name === 'namespaces'
      ),
    [targetWallet.properties]
  );

  const singleSelection = namespacesProperty?.value.selection === 'single';

  return (
    <>
      <MessageBox
        type="info"
        title={i18n.t(`Connect {wallet}`, {
          wallet: targetWallet.type,
        })}
        description={i18n.t(
          "This wallet supports multiple chains. Choose which chains you'd like to connect or disconnect."
        )}
        icon={<Image src={targetWallet.image} size={45} />}
      />
      <Divider size={20} />
      {!!singleSelection && (
        <Alert
          id="widget-wallet-stateful-connect-alert"
          variant="alarm"
          type="info"
          title={i18n.t('This wallet can only connect to one chain at a time.')}
        />
      )}
      <NamespaceList id="widget-detached-namespace-list" as={'ul'}>
        {targetWallet.needsNamespace?.data.map((namespace, index, array) => (
          <React.Fragment key={namespace.id}>
            <NamespaceItem
              namespace={namespace}
              targetWallet={targetWallet}
              singleSelection={singleSelection}
              selectedNamespaces={selectedNamespaces}
              navigateToDerivationPath={navigateToDerivationPath}
            />
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
