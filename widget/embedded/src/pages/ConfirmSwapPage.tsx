import type { ConfirmSwapFetchResult } from '../hooks/useConfirmSwap/useConfirmSwap.types';
import type { PendingSwapSettings } from '../types';

import { i18n } from '@lingui/core';
import { calculatePendingSwap } from '@rango-dev/queue-manager-rango-preset';
import { useManager } from '@rango-dev/queue-manager-react';
import {
  Alert,
  Button,
  css,
  Divider,
  IconButton,
  styled,
  Typography,
} from '@rango-dev/ui';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RefreshButton } from '../components/HeaderButtons/RefreshButton';
import { Layout, PageContainer } from '../components/Layout';
import { QuoteWarningsAndErrors } from '../components/QuoteWarningsAndErrors';
import { navigationRoutes } from '../constants/navigationRoutes';
import { QuoteInfo } from '../containers/QuoteInfo';
import { useConfirmSwap } from '../hooks/useConfirmSwap';
import { useAppStore } from '../store/AppStore';
import { useQuoteStore } from '../store/quote';
import { useUiStore } from '../store/ui';
import { QuoteErrorType, QuoteWarningType } from '../types';
import { isQuoteWarningConfirmationRequired } from '../utils/quote';
import { getWalletsForNewSwap } from '../utils/swap';
import { joinList } from '../utils/ui';

const Buttons = styled('div', {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  [`& ${IconButton}`]: {
    width: '$48',
    height: '$48',
  },
});

const confirmBtnStyles = css({
  flexGrow: 1,
  paddingRight: '$10',
});

const iconStyles = css({
  width: '$24',
  height: '$24',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const descriptionStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export function ConfirmSwapPage() {
  //TODO: move component's logics to a custom hook
  const {
    selectedQuote,
    inputAmount,
    quoteWarningsConfirmed,
    confirmSwapData,
    customDestination,
    setInputAmount,
  } = useQuoteStore();
  const { disabledLiquiditySources, customSlippage, slippage } = useAppStore();
  const tokens = useAppStore().tokens();
  const blockchains = useAppStore().blockchains();
  const sourceWallet = useAppStore().selectedWallet('source');
  const destinationWallet = useAppStore().selectedWallet('destination');
  const { isActiveTab } = useUiStore();
  const navigate = useNavigate();
  const { manager } = useManager();
  const [dbErrorMessage, setDbErrorMessage] = useState<string>('');
  const [isConfirming, setIsConfirming] = useState(false);
  const prevDisabledLiquiditySources = useRef(disabledLiquiditySources);
  const {
    fetch: confirmSwap,
    loading: fetchingConfirmationQuote,
    cancelFetch,
  } = useConfirmSwap();
  const [confirmSwapResult, setConfirmSwapResult] =
    useState<ConfirmSwapFetchResult>({
      response: confirmSwapData.result,
      error: null,
      warnings: null,
    });
  const [showQuoteWarningModal, setShowQuoteWarningModal] = useState(false);
  const selectedWalletsForConfirmation = sourceWallet
    ? [sourceWallet].concat(destinationWallet ?? [])
    : [];

  const addNewSwap = async () => {
    const data = confirmSwapResult.response || confirmSwapData.result;
    if (data) {
      try {
        const userSlippage = customSlippage || slippage;
        const swapSettings: PendingSwapSettings = {
          slippage: userSlippage.toString(),
          disabledSwappersGroups: disabledLiquiditySources,
        };

        const swap = calculatePendingSwap(
          inputAmount.toString(),
          data,
          getWalletsForNewSwap(selectedWalletsForConfirmation ?? []),
          swapSettings,
          confirmSwapData.proceedAnyway,
          { blockchains, tokens }
        );
        await manager?.create(
          'swap',
          { swapDetails: swap },
          { id: swap.requestId }
        );

        const swap_url = `../${navigationRoutes.swaps}/${confirmSwapResult.response?.requestId}`;
        navigate(swap_url, {
          replace: true,
        });
        setTimeout(() => {
          setInputAmount('');
        }, 0);
      } catch (e) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setDbErrorMessage('Error: ' + (e as any)?.message);
      }
    }
  };

  const onConfirm = async () => {
    setIsConfirming(true);
    await addNewSwap();
    setIsConfirming(false);
  };

  const onStartConfirmSwap = async () => {
    const shouldShowWarningModal =
      confirmSwapResult.warnings?.quote &&
      isQuoteWarningConfirmationRequired(confirmSwapResult.warnings.quote) &&
      !quoteWarningsConfirmed;

    if (shouldShowWarningModal) {
      setShowQuoteWarningModal(true);
    } else {
      await onConfirm();
    }
  };

  const onRefresh = async () => {
    setConfirmSwapResult({
      error: null,
      response: null,
      warnings: null,
    });
    confirmSwap({
      selectedWallets: selectedWalletsForConfirmation ?? [],
      customDestination,
    })
      .then((res) => {
        setConfirmSwapResult(res);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    const disabledLiquiditySourceReset =
      !!prevDisabledLiquiditySources.current.length &&
      !disabledLiquiditySources.length;
    if (disabledLiquiditySourceReset) {
      void onRefresh();
    }
    prevDisabledLiquiditySources.current = disabledLiquiditySources;
  }, [disabledLiquiditySources.length]);

  useLayoutEffect(() => {
    if (!selectedQuote?.requestId) {
      navigate(`../${location.search}`);
    }

    return cancelFetch;
  }, []);

  const quoteWarning = confirmSwapResult.warnings?.quote ?? null;
  const quoteError = confirmSwapResult.error;
  const alerts = [];
  if (dbErrorMessage) {
    alerts.push(
      <Alert
        id="widget-confirm-swap-db-error-alert"
        type="error"
        variant="alarm"
        title={dbErrorMessage}
      />
    );
  }

  if (quoteWarning || quoteError) {
    const settings_url = `../${navigationRoutes.settings}`;
    alerts.push(
      <QuoteWarningsAndErrors
        warning={quoteWarning}
        error={quoteError}
        couldChangeSettings={false}
        refetchQuote={onRefresh}
        skipAlerts={
          quoteError?.type === QuoteErrorType.INSUFFICIENT_SLIPPAGE ||
          quoteWarning?.type === QuoteWarningType.INSUFFICIENT_SLIPPAGE
        }
        showWarningModal={showQuoteWarningModal}
        confirmationDisabled={!isActiveTab}
        onOpenWarningModal={() => setShowQuoteWarningModal(true)}
        onCloseWarningModal={() => setShowQuoteWarningModal(false)}
        onConfirmWarningModal={async () => {
          setShowQuoteWarningModal(false);
          await addNewSwap();
        }}
        onChangeSettings={() => navigate(settings_url)}
      />
    );
  }

  return (
    <Layout
      header={{
        title: i18n.t('Confirm Swap'),
        onWallet: () => {
          const wallets_url = `../${navigationRoutes.wallets}`;
          navigate(wallets_url);
        },
      }}
      footer={
        <Buttons>
          <div className={confirmBtnStyles()}>
            <Button
              id="widget-confirm-swap-start-btn"
              variant="contained"
              type="primary"
              size="large"
              fullWidth
              loading={fetchingConfirmationQuote || isConfirming}
              disabled={!!confirmSwapResult.error || !isActiveTab}
              onClick={onStartConfirmSwap}>
              {i18n.t('Start Swap')}
            </Button>
          </div>
        </Buttons>
      }>
      <PageContainer>
        <div className={descriptionStyles()}>
          <Typography variant="title" size="small">
            {i18n.t('You get')}
          </Typography>
          <div className={iconStyles()}>
            <RefreshButton
              onClick={
                !fetchingConfirmationQuote && !showQuoteWarningModal
                  ? onRefresh
                  : undefined
              }
            />
          </div>
        </div>
        <Divider size="12" />

        {joinList(
          alerts.map((alert, index) => ({
            element: alert,
            key: `alert-${index}`,
          })),
          <Divider size={10} />
        )}
        {alerts.length > 0 ? <Divider size={10} /> : null}

        <QuoteInfo
          quote={selectedQuote}
          type="swap-preview"
          id="widget-confirm-swap-quote-container"
          expanded
          tagHidden
          error={confirmSwapResult.error}
          loading={fetchingConfirmationQuote}
          warning={confirmSwapResult.warnings?.quote ?? null}
        />
      </PageContainer>
    </Layout>
  );
}
