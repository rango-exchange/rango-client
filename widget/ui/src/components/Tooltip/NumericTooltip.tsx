import type { NumericTooltipPropTypes } from './NumericTooltip.types';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { Tooltip } from './Tooltip';

export function NumericTooltip(
  props: PropsWithChildren<NumericTooltipPropTypes>
) {
  const MAX_DECIMALS = 12;
  const formattedNumber = Number(props.content)
    .toFixed(props.maxDecimals || MAX_DECIMALS)
    .replace(/(?:\.0*|(\.\d+?)0*)$/, '$1');
  return <Tooltip {...props} content={formattedNumber} />;
}
