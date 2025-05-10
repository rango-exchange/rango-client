import type { NamespaceItemPropTypes } from './Namespaces.types';

import { Checkbox, Radio, Typography } from '@rango-dev/ui';
import React from 'react';

import { useAppStore } from '../../store/AppStore';

import { getBlockchainLogo } from './Namespaces.helpers';
import {
  NamespaceItemContainer,
  NamespaceItemContent,
  NamespaceItemInnerContent,
  NamespaceLogo,
} from './Namespaces.styles';
import { SupportedChainsList } from './SupportedChainsList';

export function NamespaceListItem(props: NamespaceItemPropTypes) {
  const { onClick, type, namespace } = props;
  const blockchains = useAppStore().blockchains();

  const showSupportedChains = namespace.chains.length > 1;
  return (
    <NamespaceItemContainer onClick={onClick} clickable>
      <NamespaceItemContent>
        <NamespaceLogo
          src={getBlockchainLogo(blockchains, namespace.id)}
          size={40}
        />
        <NamespaceItemInnerContent showSupportedChains={showSupportedChains}>
          <Typography variant="label" size="large">
            {namespace.label}
          </Typography>
          {showSupportedChains && (
            <SupportedChainsList chains={namespace.chains} />
          )}
        </NamespaceItemInnerContent>
        {type === 'radio' ? (
          <Radio value={namespace.value} />
        ) : (
          <Checkbox checked={props.value} />
        )}
      </NamespaceItemContent>
    </NamespaceItemContainer>
  );
}
