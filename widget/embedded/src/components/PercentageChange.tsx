import BigNumber from 'bignumber.js';
import React from 'react';
import { getPercentageChange } from '../utils/swap';
import { Typography } from '@rango-dev/ui';
import { numberToString } from '../utils/numbers';

interface PropTypes {
  inputUsdValue: BigNumber | null;
  outputUsdValue: BigNumber | null;
}

export function PercentageChange(props: PropTypes) {
  const { inputUsdValue, outputUsdValue } = props;

  if (!inputUsdValue || !outputUsdValue || !outputUsdValue.gt(0)) return null;

  const percentageChange = getPercentageChange(
    inputUsdValue.toNumber(),
    outputUsdValue.toNumber()
  );

  const showPercentageChange = percentageChange?.lt(0);

  return (
    <>
      {showPercentageChange && (
        <Typography variant="caption" color="$error500">
          {`(${numberToString(percentageChange, 0, 2)}%)`}
        </Typography>
      )}
    </>
  );
}
