import type { PropTypes } from './Inputs.types';

import React from 'react';

import { DestinationInput } from './DestinationInput/DestinationInput';
import { Container } from './Inputs.styles';
import { SourceInput } from './SourceInput/SourceInput';

export function Inputs(props: PropTypes) {
  const { onClickToken, fetchingQuote } = props;

  return (
    <Container>
      <SourceInput onClickToken={() => onClickToken('from')} />
      <DestinationInput
        fetchingQuote={fetchingQuote}
        onClickToken={() => onClickToken('to')}
      />
    </Container>
  );
}
