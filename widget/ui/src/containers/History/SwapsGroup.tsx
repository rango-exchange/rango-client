import { PendingSwap } from '@rango-dev/queue-manager-rango-preset';
import React from 'react';
import { Typography, SwapDetail, Divider } from '../../components';
import { styled } from '../../theme';

const Group = styled('div', {
  '.group-title': {
    textTransform: 'uppercase',
  },
});

export type GroupBy = (list: PendingSwap[]) => {
  title: string;
  swaps: PendingSwap[];
}[];

export interface PropTypes {
  list: PendingSwap[];
  onBack: () => void;
  onSwapClick: (requestId: string) => void;
  groupBy?: GroupBy;
}

export function SwapsGroup(props: Omit<PropTypes, 'onBack'>) {
  const { list, onSwapClick, groupBy } = props;
  const groups = groupBy ? groupBy(list) : [{ title: 'History', swaps: list }];

  return (
    <>
      {groups
        .filter((group) => group.swaps.length > 0)
        .map((group, index) => (
          <React.Fragment key={index}>
            <Group>
              <Typography
                variant="body2"
                color="neutrals600"
                className="group-title"
              >
                {group.title}
              </Typography>
              {group.swaps.map((swap: PendingSwap) => (
                <React.Fragment
                    key={swap.requestId}>
                  <SwapDetail
                    swap={swap}
                    status={swap.status}
                    onClick={onSwapClick}
                  />
                  <Divider size={12} />
                </React.Fragment>
              ))}
            </Group>
            <Divider size={24} />
          </React.Fragment>
        ))}
    </>
  );
}
