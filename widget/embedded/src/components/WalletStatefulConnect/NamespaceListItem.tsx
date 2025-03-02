import type { NamespaceItemPropTypes } from './Namespaces.types';

import { i18n } from '@lingui/core';
import { Checkbox, Radio, Typography } from '@rango-dev/ui';
import React from 'react';

import { useAppStore } from '../../store/AppStore';

import {
  getBlockchainLogo,
  getNamespaceSupportedChains,
} from './Namespaces.helpers';
import {
  NamespaceItemContainer,
  NamespaceItemContent,
  NamespaceLogo,
  NotSupportedNamespaceItemContent,
} from './Namespaces.styles';
import { SupportedChainsList } from './SupportedChainsList';

export function NamespaceListItem(props: NamespaceItemPropTypes) {
  const {
    onClick,
    singleSelect,
    namespace,
    checked,
    walletSupportedChains,
    showAsNetwork,
  } = props;
  const blockchains = useAppStore().blockchains();
  const supportedChains = getNamespaceSupportedChains(
    namespace.value,
    walletSupportedChains
  );

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

  return (
    <NamespaceItemContainer onClick={onClick}>
      <NamespaceLogo
        src={getBlockchainLogo(blockchains, namespace.id)}
        size={40}
      />
      <NamespaceItemContent>
        <Typography variant="label" size="large">
          {namespace.label}
        </Typography>
        {!showAsNetwork && <SupportedChainsList chains={supportedChains} />}
      </NamespaceItemContent>
      {singleSelect ? (
        <Radio value={namespace.value} />
      ) : (
        <Checkbox checked={checked} />
      )}
    </NamespaceItemContainer>
  );
}
