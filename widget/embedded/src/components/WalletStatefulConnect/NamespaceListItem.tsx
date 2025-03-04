import type { NamespaceItemPropTypes } from './Namespaces.types';

import { i18n } from '@lingui/core';
import { Checkbox, Radio, Typography } from '@rango-dev/ui';
import React from 'react';

import { useAppStore } from '../../store/AppStore';

import { getBlockchainLogo } from './Namespaces.helpers';
import {
  NamespaceItemContainer,
  NamespaceItemContent,
  NamespaceLogo,
  NotSupportedNamespaceItemContent,
} from './Namespaces.styles';
import { SupportedChainsList } from './SupportedChainsList';

export function NamespaceListItem(props: NamespaceItemPropTypes) {
  const { onClick, singleSelect, namespace, checked } = props;
  const blockchains = useAppStore().blockchains();

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
    <NamespaceItemContainer onClick={onClick} clickable>
      <NamespaceLogo
        src={getBlockchainLogo(blockchains, namespace.id)}
        size={40}
      />
      <NamespaceItemContent>
        <Typography variant="label" size="large">
          {namespace.label}
        </Typography>
        {namespace.networks.length > 1 && (
          <SupportedChainsList chains={namespace.networks} />
        )}
      </NamespaceItemContent>
      {singleSelect ? (
        <Radio value={namespace.value} />
      ) : (
        <Checkbox checked={checked} />
      )}
    </NamespaceItemContainer>
  );
}
