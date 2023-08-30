import { i18n } from '@lingui/core';
import {
  cancelSwap,
  getCurrentBlockchainOfOrNull,
  getCurrentStep,
  getRelatedWalletOrNull,
  PendingSwapNetworkStatus,
} from '@rango-dev/queue-manager-rango-preset';
import { useManager } from '@rango-dev/queue-manager-react';
import {
  BottomLogo,
  Button,
  Divider,
  MessageBox,
  Modal,
  SwapDetailsPlaceholder,
  SwapHistory,
  Typography,
  useCopyToClipboard,
} from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-react';
import { openDB } from 'idb';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Layout } from '../components/Layout';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useBestRouteStore } from '../store/bestRoute';
import { useUiStore } from '../store/ui';
import { getPendingSwaps } from '../utils/queue';
import { getFormatedPendingSwap } from '../utils/routing';
import {
  getLastConvertedTokenInFailedSwap,
  getSwapMessages,
  isNetworkStatusInWarningState,
  shouldRetrySwap,
} from '../utils/swap';
import { getSwapDate } from '../utils/time';

const RESET_INTERVAL = 2_000;
const DB_NAME = 'queues-manager';
const OBJECT_STORE_NAME = 'queues';

export function SwapDetailsPage() {
  const selectedSwapRequestId = useUiStore.use.selectedSwapRequestId();
  const { canSwitchNetworkTo, connect, getWalletInfo } = useWallets();
  const retry = useBestRouteStore.use.retry();
  const navigate = useNavigate();
  const { navigateBackFrom } = useNavigateBack();
  const [isCopied, handleCopy] = useCopyToClipboard(RESET_INTERVAL);
  const { manager, state } = useManager();
  const [open, setOpen] = useState<boolean>(false);
  const pendingSwaps = getPendingSwaps(manager);
  const selectedSwap = pendingSwaps.find(
    ({ swap }) => swap.requestId === selectedSwapRequestId
  );

  const onCancel = () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
    const swap = manager?.get(selectedSwap?.id!);
    if (swap) {
      cancelSwap(swap);
    }
  };
  const swap = selectedSwap?.swap;
  const loading = !state.loadedFromPersistor;

  if (!swap) {
    return (
      <SwapDetailsPlaceholder
        requestId={selectedSwapRequestId || ''}
        loading={loading}
        onBack={navigateBackFrom.bind(null, navigationRoutes.swapDetails)}
      />
    );
  }

  const currentStep = getCurrentStep(swap);

  const currentStepBlockchain = currentStep
    ? getCurrentBlockchainOfOrNull(swap, currentStep)
    : null;
  const currentStepWallet = currentStep
    ? getRelatedWalletOrNull(swap, currentStep)
    : null;
  const currentStepNetworkStatus = currentStep?.networkStatus;

  const swapMessages = getSwapMessages(swap, currentStep);

  const networkWarningState = isNetworkStatusInWarningState(currentStep);

  const swapDate = getSwapDate(swap);

  const shouldRetry = shouldRetrySwap(swap);

  const isMobileWallet = (walletType: string): boolean =>
    !!getWalletInfo(walletType)?.mobileWallet;

  const showSwitchNetwork =
    currentStepNetworkStatus ===
      PendingSwapNetworkStatus.WaitingForNetworkChange &&
    !!currentStepBlockchain &&
    !!currentStepWallet?.walletType &&
    (isMobileWallet(currentStepWallet.walletType) ||
      canSwitchNetworkTo(currentStepWallet.walletType, currentStepBlockchain));

  const switchNetwork = showSwitchNetwork
    ? connect.bind(null, currentStepWallet.walletType, currentStepBlockchain)
    : undefined;

  const lastConvertedTokenInFailedSwap =
    getLastConvertedTokenInFailedSwap(swap);

  const deleteFromQueue = async () => {
    //TODO: This should be done in the queue-manager
    const db = await openDB(DB_NAME, 1);
    if (swap) {
      try {
        await db.delete(OBJECT_STORE_NAME, selectedSwap?.id);
        navigateBackFrom(navigationRoutes.swapDetails);
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <Layout
      header={{
        onBack: navigateBackFrom.bind(null, navigationRoutes.swapDetails),
        title: i18n.t('Swap Details'),
        suffix: (
          <Button
            variant="ghost"
            type="error"
            size="small"
            onClick={() => setOpen(true)}>
            <Typography size="medium" variant="label" color="error">
              {i18n.t('Delete')}
            </Typography>
          </Button>
        ),
      }}>
      <SwapHistory
        onBack={navigateBackFrom.bind(null, navigationRoutes.swapDetails)}
        /* TODO: It was temporarily removed to find a better solution*/
        /*
         *previewInputs={
         *  <>
         *    <TokenPreview
         *      chain={{
         *        displayName: firstStep?.fromBlockchain || '',
         *        logo: firstStep?.fromBlockchainLogo || '',
         *      }}
         *      token={{
         *        symbol: firstStep?.fromSymbol || '',
         *        image: firstStep?.fromLogo || '',
         *      }}
         *      amount={fromAmount}
         *      label={t('From')}
         *      loadingStatus={'success'}
         *    />
         *    <Divider size={12} />
         *    <TokenPreview
         *      chain={{
         *        displayName: lastStep?.toBlockchain || '',
         *        logo: lastStep?.toBlockchainLogo || '',
         *      }}
         *      token={{
         *        symbol: lastStep?.toSymbol || '',
         *        image: lastStep?.toLogo || '',
         *      }}
         *      amount={toAmount}
         *      label={t('To')}
         *      loadingStatus={'success'}
         *    />
         *  </>
         *}
         */
        pendingSwap={getFormatedPendingSwap(swap)}
        onCopy={handleCopy}
        isCopied={isCopied}
        onCancel={onCancel}
        shortMessage={swapMessages.shortMessage}
        detailedMessage={swapMessages.detailedMessage}
        currentStepBlockchain={currentStepBlockchain || ''}
        switchNetwork={switchNetwork}
        type={
          networkWarningState
            ? 'warning'
            : swap.extraMessageSeverity || undefined
        }
        date={swapDate}
        {...(shouldRetry && {
          onRetry: () => {
            retry(swap);
            setTimeout(() => {
              navigate(navigationRoutes.home);
            }, 0);
          },
        })}
        {...(lastConvertedTokenInFailedSwap && {
          lastConvertedTokenInFailedSwap: {
            blockchain: lastConvertedTokenInFailedSwap.blockchain,
            outputAmount: lastConvertedTokenInFailedSwap.outputAmount || '',
            symbol: lastConvertedTokenInFailedSwap.symbol,
          },
        })}
      />

      <Modal
        title={''}
        open={open}
        onClose={() => setOpen(false)}
        container={document.getElementById('swap-box') || undefined}>
        <Divider size={20} />
        <MessageBox
          type="error"
          title={i18n.t('Delete Transaction')}
          description={i18n.t('Are you sure you want to delete this swap?')}
        />
        <Divider size={32} />
        <Button
          variant="contained"
          type="primary"
          size="large"
          onClick={deleteFromQueue}>
          <Typography variant="title" size="medium" color="neutral100">
            {i18n.t('Yes, Delete')}
          </Typography>
        </Button>
        <Divider size={12} />
        <Button
          variant="outlined"
          type="primary"
          size="large"
          onClick={() => setOpen(false)}>
          <Typography variant="title" size="medium" color="primary">
            {i18n.t('No, Cancel')}
          </Typography>
        </Button>
        <Divider size={20} />
        <BottomLogo />
      </Modal>
    </Layout>
  );
}
