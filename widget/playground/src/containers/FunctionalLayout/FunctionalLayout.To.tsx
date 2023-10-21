import React from 'react';

import { DefaultChainAndToken } from '../DefaultChainAndToken/DefaultChainAndToken';

import { FromToContainer } from './FunctionalLayout.styles';

export function ToSection() {
  return (
    <FromToContainer>
      <DefaultChainAndToken type="Destination" />
    </FromToContainer>
  );
}
