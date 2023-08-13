import type { PropTypes as SwapsGroupPropTypes } from './SwapsGroup';
import type { PendingSwap } from './types';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { Spinner } from '../../components';
import { NotFoundAlert } from '../../components/Alert/NotFoundAlert';
import { SecondaryPage } from '../../components/SecondaryPage';
import { containsText } from '../../helper';
import { styled } from '../../theme';
import { LoaderContainer } from '../TokenSelector/TokenSelector';

import { SwapsGroup } from './SwapsGroup';

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

export type PropTypes = SwapsGroupPropTypes & { loading: boolean };

/**
 * @deprecated will be removed in v2
 */
export function History(props: PropsWithChildren<PropTypes>) {
  const { list = [], onBack, onSwapClick, groupBy, loading } = props;

  return (
    <SecondaryPage
      onBack={onBack}
      textField={true}
      textFieldPlaceholder="Search by blockchain, token or request Id"
      title="Swaps">
      {(searchedFor) => {
        const filterSwaps = filteredHistory(list, searchedFor);
        return (
          <>
            {loading && (
              <LoaderContainer>
                <Spinner size={24} />
              </LoaderContainer>
            )}
            <Container>
              {!loading && (
                <>
                  {filterSwaps.length ? (
                    <SwapsGroup
                      list={filterSwaps}
                      onSwapClick={onSwapClick}
                      groupBy={groupBy}
                    />
                  ) : (
                    <NotFoundAlert catergory="Swap" />
                  )}
                </>
              )}
            </Container>
          </>
        );
      }}
    </SecondaryPage>
  );
}
