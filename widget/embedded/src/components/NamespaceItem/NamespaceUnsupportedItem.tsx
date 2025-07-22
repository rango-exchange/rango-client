import type { NamespaceUnsupportedItemPropTypes } from './NamespaceItem.types';

import { i18n } from '@lingui/core';
import { Typography } from '@arlert-dev/ui';
import React from 'react';

import { useAppStore } from '../../store/AppStore';

import { getBlockchainLogo } from './NamespaceItem.helpers';
import {
  NamespaceItemContainer,
  NamespaceItemContent,
  NamespaceLogo,
  UnsupportedNamespaceItemInnerContent,
} from './NamespaceItem.styles';

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
