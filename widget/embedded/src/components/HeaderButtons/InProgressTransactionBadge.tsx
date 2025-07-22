import type { PendingSwap } from 'rango-types';

import { useManager } from '@arlert-dev/queue-manager-react';
import { InProgressIcon } from '@arlert-dev/ui';
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
    <InProgressTransactionBadgeContainer id="widget-header-history-badge-container">
      <InProgressIcon color="info" size={6} />
    </InProgressTransactionBadgeContainer>
  );
};

export default InProgressTransactionBadge;
