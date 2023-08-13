import { i18n } from '@lingui/core';
import { useManager } from '@rango-dev/queue-manager-react';
import { Alert, SwapsGroup } from '@rango-dev/ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Layout } from '../components/Layout';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useUiStore } from '../store/ui';
import { groupSwapsByDate } from '../utils/date';
import { getPendingSwaps } from '../utils/queue';

export function HistoryPage() {
  const setSelectedSwap = useUiStore.use.setSelectedSwap();
  const navigate = useNavigate();
  const { navigateBackFrom } = useNavigateBack();
  const { manager, state } = useManager();
  const list = getPendingSwaps(manager).map(({ swap }) => swap);

  const loading = !state.loadedFromPersistor;

  return (
    <Layout
      hasFooter
      header={{
        onBack: navigateBackFrom.bind(null, navigationRoutes.swaps),
        title: i18n.t('History'),
      }}>
      {!loading && (
        <>
          {list.length ? (
            <SwapsGroup
              list={list}
              onSwapClick={(requestId) => {
                setSelectedSwap(requestId);
                navigate(`${requestId}`, { replace: true });
              }}
              groupBy={groupSwapsByDate}
            />
          ) : (
            <Alert type="info" title="Swap" />
          )}
        </>
      )}
    </Layout>
  );
}
