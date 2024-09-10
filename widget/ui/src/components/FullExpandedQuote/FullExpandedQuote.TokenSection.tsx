import type { TokenSectionPropTypes } from './FullExpandedQuote.types.js';

import React from 'react';

import { ChainToken } from '../ChainToken/index.js';
import { NumericTooltip } from '../Tooltip/index.js';
import { Typography } from '../Typography/index.js';

import {
  TokenInfo,
  tokenLabelStyles,
  TokenSectionContainer,
} from './FullExpandedQuote.styles.js';

export function TokenSection(props: TokenSectionPropTypes) {
  const {
    style = {},
    chainImage,
    tokenImage,
    tooltipProps,
    amount,
    name,
    isInternalSwap,
    size = 'xmedium',
  } = props;
  return (
    <TokenSectionContainer style={style} isInternalSwap={isInternalSwap}>
      <ChainToken size={size} chainImage={chainImage} tokenImage={tokenImage} />
      <TokenInfo className="token-info">
        <NumericTooltip
          content={tooltipProps?.content}
          container={tooltipProps?.container}
          side="bottom"
          open={tooltipProps?.open}>
          <Typography
            size="xsmall"
            variant="body"
            className={isInternalSwap ? tokenLabelStyles() : ''}>
            {amount}
          </Typography>
        </NumericTooltip>
        <Typography size="xsmall" variant="body" className={tokenLabelStyles()}>
          {name}
        </Typography>
      </TokenInfo>
    </TokenSectionContainer>
  );
}
