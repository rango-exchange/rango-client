import type { NamespaceUnsupportedItemPropTypes } from './Namespaces.types';

import { i18n } from '@lingui/core';
import { Typography } from '@rango-dev/ui';
import React from 'react';

import { useAppStore } from '../../store/AppStore';

import { getBlockchainLogo } from './Namespaces.helpers';
import {
  NamespaceItemContainer,
  NamespaceItemContent,
  NamespaceLogo,
  UnsupportedNamespaceItemInnerContent,
} from './Namespaces.styles';

export function NamespaceUnsupportedItem(
  props: NamespaceUnsupportedItemPropTypes
) {
  const { namespace } = props;
  const blockchains = useAppStore().blockchains();

  return (
    <NamespaceItemContainer unsupported>
      <NamespaceItemContent>
        <NamespaceLogo
          src={getBlockchainLogo(blockchains, namespace.id)}
          size={40}
          disabled
        />
        <UnsupportedNamespaceItemInnerContent>
          <Typography variant="label" size="large">
            {namespace.label}
          </Typography>
          <Typography variant="body" size="xsmall">
            {i18n.t('(Currently not supported)')}
          </Typography>
        </UnsupportedNamespaceItemInnerContent>
      </NamespaceItemContent>
    </NamespaceItemContainer>
  );
}
