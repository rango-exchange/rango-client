import React, { PropsWithChildren } from 'react';
import { Divider } from '../../components';
import { SecondaryPage } from '../../components/SecondaryPage';
import { SwapDetail } from '../../components/SwapDetail';
import { Typography } from '../../components/Typography';
import { containsText } from '../../helper';
import { styled } from '../../theme';
import { PendingSwap } from './types';
import { NotFoundAlert } from '../../components/Alert/NotFoundAlert';

const Group = styled('div', {
  '.group-title': {
    textTransform: 'uppercase',
  },
});

const Container = styled('div', {
  overflowY: 'auto',
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
const SwapsGroup = (props: Omit<PropTypes, 'onBack'>) => {
  const { list, onSwapClick, groupBy } = props;
  const groups = groupBy ? groupBy(list) : [{ title: 'History', swaps: list }];

  return (
    <>
      {groups
        .filter((group) => group.swaps.length > 0)
        .map((group, index) => (
          <>
            <Group key={index}>
              <Typography
                variant="body2"
                color="neutrals600"
                className="group-title"
              >
                {group.title}
              </Typography>
              {group.swaps.map((swap: PendingSwap, index: number) => (
                <>
                  <SwapDetail
                    key={index}
                    swap={swap}
                    status={swap.status}
                    onClick={onSwapClick}
                  />
                  <Divider size={12} />
                </>
              ))}
            </Group>
            <Divider size={24} />
          </>
        ))}
    </>
  );
};

export function History({
  list = [],
  onBack,
  onSwapClick,
  groupBy,
}: PropsWithChildren<PropTypes>) {
  return (
    <SecondaryPage
      onBack={onBack}
      textField={true}
      textFieldPlaceholder="Search by Blockchain/Token/Request Id"
      title="Swaps"
    >
      {(searchedFor) => {
        const filterSwaps = filteredHistory(list, searchedFor);
        return (
          <Container>
            {filterSwaps.length ? (
              <SwapsGroup
                list={filterSwaps}
                onSwapClick={onSwapClick}
                groupBy={groupBy}
              />
            ) : (
              <NotFoundAlert catergory="Swap" />
            )}
          </Container>
        );
      }}
    </SecondaryPage>
  );
}
