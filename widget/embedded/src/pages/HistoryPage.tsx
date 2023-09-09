import type { PendingSwap } from '@rango-dev/queue-manager-rango-preset';
import type { PendingSwapStep } from 'rango-types';

import { i18n } from '@lingui/core';
import { useManager } from '@rango-dev/queue-manager-react';
import { Alert, SearchIcon, styled, TextField } from '@rango-dev/ui';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Layout } from '../components/Layout';
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

const SwapList = styled('div', {
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
  const [filteredList, setFilteredList] = useState<PendingSwap[]>([]);
  const loading = !state.loadedFromPersistor;

  const filterTransactions = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchedFor(value);
    const filtered = list.filter(
      (swap) =>
        containsText(swap.inputAmount, value) ||
        containsText(swap.status, value) ||
        isStepContainsText(swap.steps, value)
    );
    console.log(value);
    console.log(filtered);
    setFilteredList(filtered);
  };

  return (
    <Layout
      header={{
        onBack: navigateBackFrom.bind(null, navigationRoutes.swaps),
        title: i18n.t('History'),
      }}>
      {!loading && (
        <Container>
          <TextField
            prefix={<SearchIcon />}
            fullWidth
            variant="contained"
            placeholder="Search Transaction"
            style={{
              padding: 10,
              borderRadius: 25,
              alignItems: 'center',
            }}
            onChange={filterTransactions}
            value={searchedFor}
          />
          <SwapList>
            {list.length ? (
              <SwapsGroup
                list={searchedFor ? filteredList : list}
                onSwapClick={(requestId) => {
                  setSelectedSwap(requestId);
                  navigate(`${requestId}`, { replace: true });
                }}
                groupBy={groupSwapsByDate}
              />
            ) : (
              <Alert type="info" title="Swap" />
            )}
          </SwapList>
        </Container>
      )}
    </Layout>
  );
}
