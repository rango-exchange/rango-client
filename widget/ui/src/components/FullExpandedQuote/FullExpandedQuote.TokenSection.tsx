import type { TokenSectionPropTypes } from './FullExpandedQuote.types.js';

import React from 'react';
import { InfoIcon } from 'src/icons/index.js';

import { ChainToken } from '../ChainToken/index.js';
import { textTruncate } from '../TokenAmount/TokenAmount.styles.js';
import { NumericTooltip } from '../Tooltip/index.js';
import { Typography } from '../Typography/index.js';

import {
  AmountText,
  TokenInfo,
  tokenLabelStyles,
  TokenSectionContainer,
} from './FullExpandedQuote.styles.js';

const MAX_AMOUNT_LENGTH_FOR_INFO_ICON = 6;

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
          <AmountText
            size="xsmall"
            variant="body"
            className={`${textTruncate()} ${
              isInternalSwap ? tokenLabelStyles() : ''
            }`}>
            {amount}
          </AmountText>
          {amount && amount.length > MAX_AMOUNT_LENGTH_FOR_INFO_ICON && (
            <InfoIcon color="gray" size={12} />
          )}
        </NumericTooltip>
        <Typography size="xsmall" variant="body" className={tokenLabelStyles()}>
          {name}
        </Typography>
      </TokenInfo>
    </TokenSectionContainer>
  );
}
