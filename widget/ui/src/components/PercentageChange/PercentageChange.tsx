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
        <Typography variant="title" size="small" color="$error500">
          {`(${percentageChange}%)`}
        </Typography>
      )}
    </>
  );
}
