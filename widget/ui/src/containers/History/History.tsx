import React, { PropsWithChildren } from 'react';
import SecondaryPage from '../../components/PageWithTextField/SecondaryPage';
import SwapDetail from '../../components/SwapDetail';
import Typography from '../../components/Typography';
import { GroupingOfSwaps } from '../../helper/swaps';
import { styled } from '../../theme';
import { PendingSwap } from './types';

const Group = styled('div', {
  marginBottom: '$24',
  paddingRight: '$8',
});
const GroupTitle = styled(Typography, {
  color: '$neutrals500',
});

export interface PropTypes {
  list: PendingSwap[];
}

function History({ list = [] }: PropsWithChildren<PropTypes>) {
  const swapsInGroup = GroupingOfSwaps(list);

  return (
    <SecondaryPage
      textField={true}
      textFieldPlaceholder="Search By Blockchain Or Token"
      title="History"
      Content={() => (
        <>
          {swapsInGroup.map((group) => (
            <Group>
              <GroupTitle>{group.title}</GroupTitle>
              {group.swaps.map((swap: PendingSwap) => (
                <SwapDetail swap={swap} status={swap.status} />
              ))}
            </Group>
          ))}
        </>
      )}
    />
  );
}

export default History;
