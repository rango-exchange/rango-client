import React from 'react';
import { Typography } from '..';

interface PropTypes {
  showPercentageChange: boolean;
  percentageChange: string;
}

export function PercentageChange(props: PropTypes) {
  const { percentageChange, showPercentageChange } = props;

  return (
    <>
      {showPercentageChange && (
        <Typography variant="caption" color="$error500">
          {`(${percentageChange}%)`}
        </Typography>
      )}
    </>
  );
}
