import type { PendingSwap } from 'rango-types';

import { useManager } from '@rango-dev/queue-manager-react';
import { InProgressIcon } from '@rango-dev/ui';
import React from 'react';

import { getPendingSwaps } from '../../utils/queue';

import { InProgressTransactionBadgeContainer } from './HeaderButtons.styles';

const InProgressTransactionBadge = () => {
  const { manager } = useManager();
  const list: PendingSwap[] = getPendingSwaps(manager).map(({ swap }) => swap);

  if (!list.find((swap) => swap.status === 'running')) {
    return null;
  }

  return (
    <InProgressTransactionBadgeContainer>
      <InProgressIcon color="info" size={6} />
    </InProgressTransactionBadgeContainer>
  );
};

export default InProgressTransactionBadge;
