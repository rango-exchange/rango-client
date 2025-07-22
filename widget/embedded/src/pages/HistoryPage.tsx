import { i18n } from '@lingui/core';
import { useManager } from '@arlert-dev/queue-manager-react';
import {
  Button,
  darkTheme,
  Divider,
  MessageBox,
  NotFound,
  styled,
  Typography,
} from '@arlert-dev/ui';
import {
  type PendingSwap,
  type PendingSwapStep,
  TransactionStatus,
} from 'rango-types';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { WatermarkedModal } from '../components/common/WatermarkedModal';
import { FilterSelector } from '../components/FilterSelector';
import { SuffixContainer } from '../components/HeaderButtons/HeaderButtons.styles';
import { HistoryGroupedList } from '../components/HistoryGroupedList';
import { NotFoundContainer } from '../components/HistoryGroupedList/HistoryGroupedList.styles';
import { Layout, PageContainer } from '../components/Layout';
import { SearchInput } from '../components/SearchInput';
import { getContainer } from '../utils/common';
import { groupSwapsByDate } from '../utils/date';
import { containsText } from '../utils/numbers';
import { getPendingSwaps } from '../utils/queue';

const HistoryGroupedListContainer = styled('div', {
  overflowY: 'visible',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 15,
  height: '100%',
});

const SearchAndFilterBar = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const Description = styled('div', {
  '._typography': {
    color: '$neutral700',
    [`.${darkTheme}&`]: {
      color: '$neutral900',
    },
  },
});

const transactionStatusFilters = [
  {
    id: TransactionStatus.SUCCESS,
    title: i18n.t('Complete'),
  },
  {
    id: TransactionStatus.RUNNING,
    title: i18n.t('Running'),
  },
  { id: TransactionStatus.FAILED, title: i18n.t('Failed') },
];

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
  const navigate = useNavigate();
  const { manager, state } = useManager();
  const list: PendingSwap[] = getPendingSwaps(manager).map(({ swap }) => swap);
  const [searchedFor, setSearchedFor] = useState<string>('');
  const [openFilterSelector, setOpenFilterSelector] = useState(false);
  const loading = !state.loadedFromPersistor;
  const [filterBy, setFilterBy] = useState('');
  const [openClearModal, setOpenClearModal] = useState(false);
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchedFor(value);
  };

  const filteredList = useMemo(() => {
    if (!searchedFor && !filterBy) {
      return list;
    }

    return list.filter((swap) => {
      const { inputAmount, status, steps, requestId } = swap;

      const matchesSearch =
        !searchedFor ||
        containsText(inputAmount, searchedFor) ||
        containsText(status, searchedFor) ||
        isStepContainsText(steps, searchedFor) ||
        containsText(requestId, searchedFor);

      const matchesFilter = !filterBy || filterBy === status;

      return matchesSearch && matchesFilter;
    });
  }, [list, searchedFor, filterBy]);

  const isEmpty = !filteredList?.length && !loading;

  const onCloseModal = () => setOpenClearModal(false);
  const onClear = async () => {
    try {
      await manager?.clearQueue();

      setOpenClearModal(false);
    } catch (e) {
      console.log(e);
    }
  };
  const isClearButtonDisabled = useMemo(() => {
    return !list.some(
      (swap) =>
        swap.status === TransactionStatus.SUCCESS ||
        swap.status === TransactionStatus.FAILED
    );
  }, [list]);

  return (
    <Layout
      header={{
        title: i18n.t('History'),
        suffix: (
          <SuffixContainer>
            <Button
              id="widget-history-clear-btn"
              disabled={isClearButtonDisabled}
              variant="ghost"
              size="xsmall"
              onClick={() => setOpenClearModal(true)}>
              <Typography size="medium" variant="label" color="error">
                {i18n.t('Clear')}
              </Typography>
            </Button>
          </SuffixContainer>
        ),
      }}>
      <PageContainer>
        <SearchAndFilterBar>
          <SearchInput
            setValue={setSearchedFor}
            fullWidth
            variant="contained"
            placeholder={i18n.t('Search Transaction')}
            id="widget-history-search-transaction-input"
            autoFocus
            onChange={handleSearch}
            style={{ height: 36 }}
            value={searchedFor}
          />
          <Divider size={10} direction="horizontal" />

          <FilterSelector
            filterBy={filterBy}
            open={openFilterSelector}
            onOpenChange={(open) => setOpenFilterSelector(open)}
            onClickItem={(id) => setFilterBy(id)}
            list={transactionStatusFilters}
          />
        </SearchAndFilterBar>

        <Divider size="16" />
        <HistoryGroupedListContainer>
          {isEmpty && (
            <NotFoundContainer>
              <Divider size={32} />
              <NotFound
                title={
                  searchedFor
                    ? i18n.t('No results found')
                    : i18n.t('No transactions')
                }
                titleColor={!searchedFor ? '$info' : undefined}
                hasIcon={!!searchedFor}
                description={
                  searchedFor
                    ? i18n.t('Try using different keywords')
                    : i18n.t(
                        'Your transaction history is stored locally and will appear here after you start a swap'
                      )
                }
              />
            </NotFoundContainer>
          )}
          {!isEmpty && (
            <HistoryGroupedList
              list={filteredList}
              onSwapClick={navigate}
              groupBy={groupSwapsByDate}
              isLoading={loading}
            />
          )}
        </HistoryGroupedListContainer>
      </PageContainer>
      <WatermarkedModal
        open={openClearModal}
        onClose={onCloseModal}
        id="widget-history-clear-modal"
        container={getContainer()}>
        <Divider size={20} />
        <MessageBox
          type="warning"
          title={i18n.t('Clear Transaction History')}
          description={
            <Description>
              <Typography variant="body" size="medium">
                {i18n.t(
                  'Proceeding will remove all successful and failed transactions from the widget. Do you want to continue?'
                )}
              </Typography>
              <Divider size={'24'} />

              <Typography variant="body" size="small">
                {i18n.t(
                  'Note: This does not erase your transaction history on the chain; it only removes them here.'
                )}
              </Typography>
            </Description>
          }
        />
        <Divider size={30} />
        <Button
          id="widget-history-clear-modal-yes-btn"
          variant="contained"
          type="primary"
          size="large"
          onClick={onClear}>
          {i18n.t('Yes, Clear the history')}
        </Button>
        <Divider size={10} />
        <Button
          id="widget-history-clear-modal-no-btn"
          variant="outlined"
          type="primary"
          size="large"
          onClick={onCloseModal}>
          <Typography variant="title" size="medium" color="primary">
            {i18n.t('No, Cancel')}
          </Typography>
        </Button>
      </WatermarkedModal>
    </Layout>
  );
}
