import type { SelectedQuote } from '../types';

import { i18n } from '@lingui/core';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { HeaderButtons } from '../components/HeaderButtons';
import { Layout, PageContainer } from '../components/Layout';
import { Quotes } from '../components/Quotes';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useSwapInput } from '../hooks/useSwapInput';
import { useQuoteStore } from '../store/quote';

export function RoutesPage() {
  const navigate = useNavigate();
  const navigateBack = useNavigateBack();

  const {
    selectedQuote,
    refetchQuote,
    setSelectedQuote,
    updateQuotePartialState,
    error: quoteError,
  } = useQuoteStore();

  const { fetch: fetchQuote, loading: fetchingQuote } = useSwapInput({
    refetchQuote,
  });

  const onClickOnQuote = (quote: SelectedQuote) => {
    setSelectedQuote(quote);
    updateQuotePartialState('refetchQuote', false);
    navigateBack();
  };

  const settings_url = `../${navigationRoutes.settings}`;
  const wallets_url = `../${navigationRoutes.wallets}`;
  return (
    <Layout
      header={{
        onWallet: () => {
          navigate(wallets_url);
        },
        onBack: () => {
          updateQuotePartialState('refetchQuote', false);
        },
        title: i18n.t('Routes'),
        suffix: (
          <HeaderButtons
            onClickRefresh={
              !!selectedQuote || quoteError ? fetchQuote : undefined
            }
            hidden={['notifications', 'history']}
            onClickSettings={() => navigate(settings_url)}
          />
        ),
      }}>
      <PageContainer>
        <Quotes
          fetch={fetchQuote}
          loading={fetchingQuote}
          onClickOnQuote={onClickOnQuote}
        />
      </PageContainer>
    </Layout>
  );
}
