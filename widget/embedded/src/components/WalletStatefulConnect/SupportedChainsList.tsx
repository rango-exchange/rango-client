import type { PropTypes } from './SupportedChainsList.types';

import { Image, Tooltip, Typography } from '@rango-dev/ui';
import React from 'react';

import { getContainer } from '../../utils/common';

import {
  SupportedChainItem,
  SupportedChainsContainer,
} from './SupportedChainsList.styles';

const SUPPORTED_CHAINS_MAX_DISPLAYED_NUMBER = 3;

export function SupportedChainsList(props: PropTypes) {
  const { chains } = props;
  return (
    <SupportedChainsContainer>
      {chains
        .slice(0, SUPPORTED_CHAINS_MAX_DISPLAYED_NUMBER)
        .map((chain, index) => (
          <SupportedChainItem key={chain.name} firstItem={index === 0}>
            <Image src={chain.logo} size={15} />
          </SupportedChainItem>
        ))}
      {chains.length > SUPPORTED_CHAINS_MAX_DISPLAYED_NUMBER && (
        <Tooltip
          container={getContainer()}
          side="bottom"
          align="start"
          content={
            <SupportedChainsContainer>
              {chains.map((chain, index) => (
                <SupportedChainItem key={chain.name} firstItem={index === 0}>
                  <Image src={chain.logo} size={15} />
                </SupportedChainItem>
              ))}
            </SupportedChainsContainer>
          }>
          <SupportedChainItem>
            <Typography variant="body" size="xsmall">
              +{chains.length - SUPPORTED_CHAINS_MAX_DISPLAYED_NUMBER}
            </Typography>
          </SupportedChainItem>
        </Tooltip>
      )}
    </SupportedChainsContainer>
  );
}
