import type {
  ConfirmSwap,
  ConfirmSwapFetchResult,
} from '../hooks/useConfirmSwap/useConfirmSwap.types';

import { i18n } from '@lingui/core';
import { useManager } from '@arlert-dev/queue-manager-react';
import {
  Alert,
  Button,
  css,
  Divider,
  IconButton,
  styled,
  Typography,
  WalletIcon,
} from '@arlert-dev/ui';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ConfirmWalletsModal } from '../components/ConfirmWalletsModal/ConfirmWalletsModal';
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
    setInputAmount,
    selectedWallets,
    quoteWalletsConfirmed,
    customDestination,
    quoteWarningsConfirmed,
  } = useQuoteStore();
  const navigate = useNavigate();
  const [dbErrorMessage, setDbErrorMessage] = useState<string>('');

  const showWalletsOnInit = !quoteWalletsConfirmed;
  const [showWallets, setShowWallets] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const { isActiveTab } = useUiStore();
  const disabledLiquiditySources = useAppStore().getDisabledLiquiditySources();
  const prevDisabledLiquiditySources = useRef(disabledLiquiditySources);
  const { manager } = useManager();
  const {
    fetch: confirmSwap,
    loading: fetchingConfirmationQuote,
    cancelFetch,
  } = useConfirmSwap();
  const [confirmSwapResult, setConfirmSwapResult] =
    useState<ConfirmSwapFetchResult>({
      swap: null,
      error: null,
      warnings: null,
    });
  const [showQuoteWarningModal, setShowQuoteWarningModal] = useState(false);

  const onConfirmSwap: ConfirmSwap['fetch'] = async ({
    selectedWallets,
    customDestination,
  }) => {
    const result = await confirmSwap?.({ selectedWallets, customDestination });

    setConfirmSwapResult(result);
    return result;
  };

  const addNewSwap = async () => {
    if (confirmSwapResult.swap && quoteWalletsConfirmed) {
      try {
        await manager?.create(
          'swap',
          { swapDetails: confirmSwapResult.swap },
          { id: confirmSwapResult.swap.requestId }
        );

        const swap_url = `../${navigationRoutes.swaps}/${confirmSwapResult.swap.requestId}`;
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
      swap: null,
      warnings: null,
    });
    confirmSwap({ selectedWallets, customDestination })
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

  useEffect(() => {
    if (showWalletsOnInit) {
      cancelFetch();
    }
  }, [showWalletsOnInit]);

  useEffect(() => {
    if (showWalletsOnInit) {
      setShowWallets(showWalletsOnInit);
    }
  }, [showWalletsOnInit]);

  useEffect(() => {
    if (!showWalletsOnInit) {
      confirmSwap({ selectedWallets, customDestination })
        .then((result) => setConfirmSwapResult(result))
        .catch((error) => console.error(error));
    }
  }, []);

  useLayoutEffect(() => {
    if (!selectedQuote?.requestId) {
      navigate(`../${location.search}`);
    }
  }, [selectedQuote?.requestId]);

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
          <IconButton
            id="widget-confirm-swap-wallet-icon-btn"
            variant="contained"
            type="primary"
            size="large"
            loading={fetchingConfirmationQuote || isConfirming}
            disabled={!isActiveTab}
            onClick={setShowWallets.bind(null, true)}>
            <WalletIcon size={24} />
          </IconButton>
        </Buttons>
      }>
      {showWallets && (
        <ConfirmWalletsModal
          open={showWallets}
          onClose={() => setShowWallets(false)}
          onCancel={cancelFetch}
          loading={fetchingConfirmationQuote}
          onCheckBalance={onConfirmSwap}
        />
      )}

      <PageContainer>
        <div className={descriptionStyles()}>
          <Typography variant="title" size="small">
            {i18n.t('You get')}
          </Typography>
          <div className={iconStyles()}>
            <RefreshButton
              onClick={
                !fetchingConfirmationQuote &&
                !showWallets &&
                !showQuoteWarningModal
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
