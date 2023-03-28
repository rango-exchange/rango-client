import React, { PropsWithChildren } from 'react';
import { SecondaryPage } from '../../components/SecondaryPage';
import { SwapDetail } from '../../components/SwapDetail';
import { Typography } from '../../components/Typography';
import { containsText } from '../../helper';
import { groupingOfSwaps } from '../../helper/swaps';
import { styled } from '../../theme';
import { PendingSwap } from './types';

const BodyError = styled('div', {
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
const ErrorMsg = styled(Typography, {
  color: '$error',
});
const filteredHistory = (
  list: PendingSwap[],
  searchedFor: string
): PendingSwap[] => {
  return list.filter((swap) => {
    const firstStep = swap.steps[0];
    const lastStep = swap.steps[swap.steps.length - 1];
    return (
      containsText(firstStep.fromBlockchain, searchedFor) ||
      containsText(firstStep.fromSymbol, searchedFor) ||
      containsText(lastStep.toBlockchain, searchedFor) ||
      containsText(lastStep.toSymbol, searchedFor) ||
      containsText(swap.requestId, searchedFor)
    );
  });
};
const Group = styled('div', {
  marginBottom: '$24',
  paddingRight: '$8',
  maxHeight: '600px',
});
const GroupTitle = styled(Typography, {
  color: '$neutrals500',
});

export interface PropTypes {
  list: PendingSwap[];
  onBack: () => void;
  onSwapClick: (requestId: string) => void;
}
const SwapsGroup = (props: Omit<PropTypes, 'onBack'>) => {
  const { list, onSwapClick } = props;
  const swapsInGroup = groupingOfSwaps(list);

  return (
    <>
      {swapsInGroup.map((group, index) => (
        <Group key={index}>
          <GroupTitle variant="body2">{group.title}</GroupTitle>
          {group.swaps.map((swap: PendingSwap, index: number) => (
            <SwapDetail
              key={index}
              swap={swap}
              status={swap.status}
              onClick={onSwapClick}
            />
          ))}
        </Group>
      ))}
    </>
  );
};

export function History({
  list = [],
  onBack,
  onSwapClick,
}: PropsWithChildren<PropTypes>) {
  return (
    <SecondaryPage
      onBack={onBack}
      textField={true}
      textFieldPlaceholder="Search By Blockchain Or Token"
      title="History"
    >
      {(searchedFor) => {
        const filterSwaps = filteredHistory(list, searchedFor);
        return filterSwaps.length ? (
          <SwapsGroup list={filterSwaps} onSwapClick={onSwapClick} />
        ) : (
          <BodyError>
            <ErrorMsg variant="caption">Not Found</ErrorMsg>
          </BodyError>
        );
      }}
    </SecondaryPage>
  );
}
