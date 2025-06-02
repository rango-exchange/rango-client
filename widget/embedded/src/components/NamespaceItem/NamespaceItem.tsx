import type { PropTypes } from './NamespaceItem.types';

import { i18n } from '@lingui/core';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Divider,
  Typography,
} from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';

import { useAppStore } from '../../store/AppStore';

import { getBlockchainLogo } from './NamespaceItem.helpers';
import {
  NamespaceAccountAddress,
  NamespaceItemContainer,
  NamespaceItemContent,
  NamespaceItemError,
  NamespaceItemErrorDropdownToggle,
  NamespaceItemInfo,
  NamespaceItemInnerContent,
  NamespaceLogo,
} from './NamespaceItem.styles';
import { SupportedChainsList } from './SupportedChainsList';

export function NamespaceItem(props: PropTypes) {
  const { namespace, error, suffix, connected, address, onClick } = props;

  const [errorIsExpanded, setErrorIsExpanded] = useState(false);
  const blockchains = useAppStore().blockchains();

  useEffect(() => setErrorIsExpanded(false), [error]);

  const supportedChains = namespace.getSupportedChains(blockchains);
  const isSupportedChainsDisplayed =
    !error && !connected && supportedChains.length > 1;

  return (
    <NamespaceItemContainer
      hasError={!!error}
      clickable={!!onClick}
      onClick={onClick}>
      <NamespaceItemContent>
        <NamespaceLogo
          src={getBlockchainLogo(blockchains, namespace.id)}
          size={40}
        />
        <NamespaceItemInnerContent
          showSupportedChains={
            isSupportedChainsDisplayed || connected || !!error
          }>
          <NamespaceItemInfo>
            <Typography variant="label" size="large">
              {namespace.label}
            </Typography>
            {connected && (
              <Typography variant="body" size="small" color="success500">
                {i18n.t('Connected')}
              </Typography>
            )}
            {!!error && (
              <Typography variant="body" size="small" color="error500">
                {i18n.t('Connection failed')}
              </Typography>
            )}
          </NamespaceItemInfo>
          {isSupportedChainsDisplayed && (
            <SupportedChainsList chains={supportedChains} />
          )}
          {connected && (
            <NamespaceAccountAddress
              variant="body"
              size="small"
              color="neutral700">
              {address}
            </NamespaceAccountAddress>
          )}
          {error && (
            <NamespaceItemErrorDropdownToggle
              onClick={() =>
                setErrorIsExpanded((errorIsExpanded) => !errorIsExpanded)
              }>
              <Typography
                variant="body"
                size="small"
                color="neutral700"
                style={{
                  textDecoration: 'underline',
                  userSelect: 'none',
                  textDecorationSkipInk: 'none',
                }}>
                {i18n.t('See why')}
              </Typography>
              {errorIsExpanded ? (
                <ChevronUpIcon size={12} color="gray" />
              ) : (
                <ChevronDownIcon size={12} color="gray" />
              )}
            </NamespaceItemErrorDropdownToggle>
          )}
        </NamespaceItemInnerContent>
        {suffix}
      </NamespaceItemContent>
      {!!error && errorIsExpanded && (
        <>
          <Divider size={4} />
          <NamespaceItemError>
            <Typography variant="body" size="small" color="neutral700">
              {error}
            </Typography>
          </NamespaceItemError>
        </>
      )}
    </NamespaceItemContainer>
  );
}
