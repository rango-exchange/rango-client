import { Checkbox, Skeleton } from '@arlert-dev/ui';
import React from 'react';

import { LiquiditySourceList } from '../SettingsContainer';

import { CustomListItem } from './LoadingLiquiditySourceList.styles';

const ITEM_SKELETON_COUNT = 30;
export function LoadingLiquiditySourceList() {
  return (
    <LiquiditySourceList>
      {Array.from(Array(ITEM_SKELETON_COUNT), (_, index) => (
        <CustomListItem
          hasDivider
          key={index}
          start={<Skeleton variant="circular" width={35} height={35} />}
          title={<Skeleton variant="text" size="large" width={90} />}
          end={<Checkbox checked={false} />}
        />
      ))}
    </LiquiditySourceList>
  );
}
