import type { PendingSwap } from '@rango-dev/queue-manager-rango-preset';
import type { PendingSwapStep } from 'rango-types';

import { i18n } from '@lingui/core';
import { useManager } from '@rango-dev/queue-manager-react';
import { styled } from '@rango-dev/ui';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Layout } from '../components/Layout';
import { SearchInput } from '../components/SearchInput';
import { SwapsGroup } from '../components/SwapsGroup';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useUiStore } from '../store/ui';
import { groupSwapsByDate } from '../utils/date';
import { containsText } from '../utils/numbers';
import { getPendingSwaps } from '../utils/queue';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 15,
});

const SwapsGroupContainer = styled('div', {
  overflowY: 'auto',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 15,
  height: 440,
  paddingRight: '$8',
});

const isStepContainsText = (steps: PendingSwapStep[], value: string) => {
  if (!steps?.length) {
    return false;
  }
  return steps.filter(
    (step) =>
      containsText(step.fromBlockchain, value) ||
      containsText(step.toBlockchain, value) ||
      containsText(step.toSymbol, value) ||
      containsText(step.fromSymbol, value)
  ).length;
};

export function HistoryPage() {
  const setSelectedSwap = useUiStore.use.setSelectedSwap();
  const navigate = useNavigate();
  const { navigateBackFrom } = useNavigateBack();
  const { manager, state } = useManager();
  const list: PendingSwap[] = getPendingSwaps(manager).map(({ swap }) => swap);
  const [searchedFor, setSearchedFor] = useState<string>('');
  const loading = !state.loadedFromPersistor;

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchedFor(value);
  };

  let filteredList = list;
  if (searchedFor) {
    filteredList = list.filter(
      (swap) =>
        containsText(swap.inputAmount, searchedFor) ||
        containsText(swap.status, searchedFor) ||
        isStepContainsText(swap.steps, searchedFor) ||
        containsText(swap.requestId, searchedFor)
    );
  }

  // TODO: Loading page is not designed yet.
  const isEmpty = loading || (!list?.length && !searchedFor);

  return (
    <Layout
      header={{
        onBack: navigateBackFrom.bind(null, navigationRoutes.swaps),
        title: i18n.t('History'),
      }}>
      {!isEmpty && (
        <Container>
          <SearchInput
            setValue={setSearchedFor}
            fullWidth
            variant="contained"
            placeholder="Search Transaction"
            autoFocus
            onChange={searchHandler}
            value={searchedFor}
          />
          <SwapsGroupContainer>
            <SwapsGroup
              list={filteredList}
              onSwapClick={(requestId) => {
                setSelectedSwap(requestId);
                navigate(`${requestId}`, { replace: true });
              }}
              groupBy={groupSwapsByDate}
            />
          </SwapsGroupContainer>
        </Container>
      )}
    </Layout>
  );
}
