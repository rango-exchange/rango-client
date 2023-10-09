import { Checkbox, Skeleton } from '@rango-dev/ui';
import React from 'react';

import { LiquiditySourceList } from '../SettingsContainer';

import { CustomeListItem } from './LoadingLiquiditySourceList.styles';

const ITEM_SKELETON_COUNT = 30;
export function LoadingLiquiditySourceList() {
  return (
    <LiquiditySourceList>
      {Array.from(Array(ITEM_SKELETON_COUNT), (e) => (
        <CustomeListItem
          hasDivider
          key={e}
          start={<Skeleton variant="circular" width={35} height={35} />}
          title={<Skeleton variant="text" size="large" width={90} />}
          end={<Checkbox checked={false} />}
        />
      ))}
    </LiquiditySourceList>
  );
}
