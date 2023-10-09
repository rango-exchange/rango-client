import type { LoadingTokenListProps } from './TokenList.types';

import { Divider, ListItem, Skeleton } from '@rango-dev/ui';
import React from 'react';

import { End, List } from './TokenList.styles';

export function LoadingTokenList(props: LoadingTokenListProps) {
  return (
    <List>
      {Array.from(Array(props.size), (e) => (
        <ListItem
          key={e}
          hasDivider
          start={<Skeleton variant="circular" width={35} height={35} />}
          end={
            <End>
              <Skeleton variant="text" size="large" width={70} />
              <Divider size={4} />
              <Skeleton variant="text" size="medium" width={50} />
            </End>
          }
          title={
            <div>
              <Skeleton variant="text" size="large" width={90} />
              <Divider size={4} />
              <Skeleton variant="text" size="medium" width={90} />
            </div>
          }
        />
      ))}
    </List>
  );
}
