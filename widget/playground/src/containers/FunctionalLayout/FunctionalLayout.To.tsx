import { Divider } from '@yeager-dev/ui';
import React from 'react';

import { DefaultChainAndToken } from '../DefaultChainAndToken/DefaultChainAndToken';
import { SupportedBlockchains } from '../SupportedBlockchains';
import { SupportedTokens } from '../SupportedTokens';

import { FromToContainer } from './FunctionalLayout.styles';

export function ToSection() {
  return (
    <>
      <SupportedBlockchains type="Destination" />
      <Divider size={12} />

      <SupportedTokens type="Destination" />
      <Divider size={12} />

      <FromToContainer>
        <DefaultChainAndToken type="Destination" />
      </FromToContainer>
    </>
  );
}
