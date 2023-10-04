import type { Step } from './BestRoute.types';
import type { PriceImpactWarningLevel } from '../PriceImpact';

import React from 'react';

import { TokenAmount } from '../TokenAmount';

import { Container } from './RouteSummary.styles';

type PropTypes = {
  from: Step['from'];
  to: Step['to'];
  percentageChange?: string | null;
  warningLevel: PriceImpactWarningLevel;
};

export function RouteSummary(props: PropTypes) {
  const { from, to, percentageChange, warningLevel } = props;
  return (
    <Container>
      <TokenAmount
        direction="horizontal"
        label="Swap input"
        type="input"
        price={{ value: from.price.value, usdValue: from.price.usdValue }}
        token={{
          displayName: from.token.displayName,
          image: from.token.image,
        }}
        chain={{ image: from.chain.image }}
      />
      <div className="separator" />
      <TokenAmount
        direction="horizontal"
        label="Estimated output"
        type="output"
        price={{ value: to.price.value, usdValue: to.price.usdValue }}
        token={{
          displayName: to.token.displayName,
          image: to.token.image,
        }}
        chain={{ image: to.chain.image }}
        percentageChange={percentageChange}
        warningLevel={warningLevel}
      />
    </Container>
  );
}
