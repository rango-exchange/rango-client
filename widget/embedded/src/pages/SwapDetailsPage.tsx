import React from 'react';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useManager } from '@rango-dev/queue-manager-react';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { getPendingSwaps } from '../utils/queue';
import { SwapHistory, useCopyToClipboard } from '@rango-dev/ui';
import { useUiStore } from '../store/ui';
import {
  cancelSwap,
  PendingSwapNetworkStatus,
} from '@rango-dev/queue-manager-rango-preset';
import { useWallets } from '@rango-dev/wallets-core';
import {
  getCurrentBlockchainOfOrNull,
  getCurrentStep,
  getRelatedWalletOrNull,
} from '@rango-dev/queue-manager-rango-preset';
import { getSwapDate } from '../utils/time';
import { useNavigate } from 'react-router-dom';
import { useBestRouteStore } from '../store/bestRoute';
import {
  getLastConvertedTokenInFailedSwap,
  getSwapMessages,
  isNetworkStatusInWarningState,
  shouldRetrySwap,
} from '../utils/swap';
//@ts-ignore
import { t } from 'i18next';
import { SwapDetailsPlaceholder } from '../components/SwapDetailsPlaceholder';
import { getFormatedPendingSwap } from '../utils/routing';

export function SwapDetailsPage() {
  const selectedSwapRequestId = useUiStore.use.selectedSwapRequestId();
  const { canSwitchNetworkTo, connect } = useWallets();
  const retry = useBestRouteStore.use.retry();
  const navigate = useNavigate();
  const { navigateBackFrom } = useNavigateBack();
  const [isCopied, handleCopy] = useCopyToClipboard(2000);
  const { manager, state } = useManager();

  const pendingSwaps = getPendingSwaps(manager);
  const selectedSwap = pendingSwaps.find(
    ({ swap }) => swap.requestId === selectedSwapRequestId
  );

  const onCancel = () => {
    const swap = manager?.get(selectedSwap?.id!);
    if (swap) cancelSwap(swap);
  };
  const swap = selectedSwap?.swap;
  const loading = !state.loadedFromPersistor;

  if (!swap)
    return (
      <SwapDetailsPlaceholder
        requestId={selectedSwapRequestId || ''}
        loading={loading}
        onBack={navigateBackFrom.bind(null, navigationRoutes.swapDetails)}
      />
    );

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

  const switchNetwork =
    !!currentStepBlockchain &&
    !!currentStepWallet?.walletType &&
    currentStepNetworkStatus ===
      PendingSwapNetworkStatus.WaitingForNetworkChange &&
    canSwitchNetworkTo(currentStepWallet?.walletType, currentStepBlockchain)
      ? connect.bind(null, currentStepWallet.walletType, currentStepBlockchain)
      : undefined;

  const lastConvertedTokenInFailedSwap =
    getLastConvertedTokenInFailedSwap(swap);

  return (
    <SwapHistory
      onBack={navigateBackFrom.bind(null, navigationRoutes.swapDetails)}
      /* TODO: It was temporarily removed to find a better solution*/
      /*
      previewInputs={
        <>
          <TokenPreview
            chain={{
              displayName: firstStep?.fromBlockchain || '',
              logo: firstStep?.fromBlockchainLogo || '',
            }}
            token={{
              symbol: firstStep?.fromSymbol || '',
              image: firstStep?.fromLogo || '',
            }}
            amount={fromAmount}
            label={t('From')}
            loadingStatus={'success'}
          />
          <Divider size={12} />
          <TokenPreview
            chain={{
              displayName: lastStep?.toBlockchain || '',
              logo: lastStep?.toBlockchainLogo || '',
            }}
            token={{
              symbol: lastStep?.toSymbol || '',
              image: lastStep?.toLogo || '',
            }}
            amount={toAmount}
            label={t('To')}
            loadingStatus={'success'}
          />
        </>
      }
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
        networkWarningState ? 'warning' : swap.extraMessageSeverity || undefined
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
  );
}
