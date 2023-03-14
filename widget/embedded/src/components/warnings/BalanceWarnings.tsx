import { Typography } from '@rango-dev/ui';
import React from 'react';

interface PropTypes {
  messages: string[];
}

export function BalanceWarnings({ messages }: PropTypes) {
  return (
    <div>
      {messages.map((warning) => (
        <Typography variant="body2">{warning}</Typography>
      ))}
    </div>
  );
}
