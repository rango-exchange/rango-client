import type { PropTypes } from './Namespaces.types';
import type { Namespace } from '@rango-dev/wallets-core/namespaces/common';

import { i18n } from '@lingui/core';
import {
  Alert,
  Button,
  Divider,
  Image,
  MessageBox,
  RadioRoot,
} from '@rango-dev/ui';
import React, { useEffect, useMemo, useState } from 'react';

import { NamespaceListItem } from './NamespaceListItem';
import { NamespaceList } from './Namespaces.styles';

export function Namespaces(props: PropTypes) {
  const { targetWallet } = props.value;
  const singleNamespace = targetWallet.needsNamespace?.selection === 'single';
  const providerImage = targetWallet.image;

  const [selectedNamespaces, setSelectedNamespaces] = useState<Namespace[]>([]);
  const supportedNamespaces = useMemo(
    () =>
      targetWallet.needsNamespace?.data.filter(
        (namespace) => !namespace.unsupported
      ),
    [targetWallet?.type]
  );

  const onSelect = (namespace: Namespace) => {
    if (singleNamespace) {
      setSelectedNamespaces([namespace]);
    } else {
      setSelectedNamespaces((selectedNamespaces) =>
        selectedNamespaces.includes(namespace)
          ? selectedNamespaces.filter((item) => item !== namespace)
          : selectedNamespaces.concat(namespace)
      );
    }
  };

  const allSupportedNamespacesSelected =
    supportedNamespaces?.length === selectedNamespaces.length;

  const onSelectAll = () => {
    if (singleNamespace) {
      throw new Error(
        'onSelectAll should not be called on single selection mode.'
      );
    } else if (allSupportedNamespacesSelected) {
      setSelectedNamespaces([]);
    } else if (supportedNamespaces) {
      setSelectedNamespaces(
        supportedNamespaces.map((namespace) => namespace.value)
      );
    }
  };

  const wrapRadioRoot = (children: React.ReactNode) => {
    if (singleNamespace) {
      return <RadioRoot value={selectedNamespaces?.[0]}>{children}</RadioRoot>;
    }

    return <>{children}</>;
  };

  useEffect(() => {
    // Initially select supported and required namespaces
    if (!singleNamespace && supportedNamespaces) {
      if (!!props.value.defaultSelectedChains?.length) {
        const namespacesContainingDefaultSelectedChains =
          supportedNamespaces.filter((namespace) =>
            namespace.chains.some((chain) =>
              props.value.defaultSelectedChains?.includes(chain.name)
            )
          );
        setSelectedNamespaces(
          namespacesContainingDefaultSelectedChains.map(
            (namespace) => namespace.value
          )
        );
      } else {
        setSelectedNamespaces(
          supportedNamespaces.map((namespace) => namespace.value)
        );
      }
    }
  }, []);

  return (
    <>
      <MessageBox
        type="info"
        title={i18n.t(`Connect {wallet}`, {
          wallet: targetWallet.title,
        })}
        description={i18n.t(
          "This wallet supports multiple chains. Choose which chains you'd like to connect to."
        )}
        icon={<Image src={providerImage} size={45} />}
      />
      {singleNamespace ? (
        <>
          <Divider size={20} />
          <Alert
            variant="alarm"
            type="info"
            title={i18n.t(
              'This wallet can only connect to one chain at a time. '
            )}
          />
        </>
      ) : (
        <>
          <Divider size={30} />
          <Button
            style={{ marginLeft: 'auto' }}
            id="widget-name-space-select-all-btn"
            size="xsmall"
            variant="ghost"
            type="primary"
            onClick={onSelectAll}>
            {allSupportedNamespacesSelected
              ? i18n.t('Deselect all')
              : i18n.t('Select all')}
          </Button>
        </>
      )}
      <NamespaceList>
        {wrapRadioRoot(
          <>
            {targetWallet.needsNamespace?.data.map(
              (namespace, index, array) => (
                <React.Fragment key={namespace.id}>
                  <NamespaceListItem
                    value={selectedNamespaces.includes(namespace.value)}
                    namespace={namespace}
                    type={singleNamespace ? 'radio' : 'checkbox'}
                    onClick={() => onSelect(namespace.value)}
                  />
                  {index !== array.length - 1 && <Divider size={10} />}
                </React.Fragment>
              )
            )}
          </>
        )}
      </NamespaceList>
      <Divider size={20} />
      <Button
        id="widget-name-space-confirm-btn"
        type="primary"
        disabled={!selectedNamespaces.length}
        onClick={() => props.onConfirm(selectedNamespaces)}>
        {i18n.t('Connect')}
      </Button>
    </>
  );
}
