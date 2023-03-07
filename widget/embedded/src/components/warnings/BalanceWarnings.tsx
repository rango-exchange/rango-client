import { Typography } from '@rango-dev/ui';
import React from 'react';

export function BalanceWarnings(warnings: string[]) {
  return (
    <div>
      {warnings.map((warning) => (
        <Typography variant="body2">{warning}</Typography>
      ))}
    </div>
  );
}
