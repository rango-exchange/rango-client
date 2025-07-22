import { ListItem, Skeleton } from '@arlert-dev/ui';
import React from 'react';

import { List } from './BlockchainList.styles';

const ITEM_SKELETON_COUNT = 20;
export function LoadingBlockchainList() {
  return (
    <List id="widget-blockchain-loading-list" as="ul">
      {Array.from(Array(ITEM_SKELETON_COUNT), (e) => (
        <ListItem
          key={e}
          hasDivider
          start={<Skeleton variant="circular" width={35} height={35} />}
          title={<Skeleton variant="text" size="large" width={90} />}
        />
      ))}
    </List>
  );
}
