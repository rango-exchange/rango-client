import React from 'react';
import { navigationRoutes } from '../constants/navigationRoutes';
import useCopyToClipboard from '../hooks/useCopyToClipboard';
import { useManager } from '@rango-dev/queue-manager-react';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { getPendingSwaps } from '../utils/queue';
import { SwapHistory } from '@rango-dev/ui';
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

export function SwapDetailsPage() {
  const selectedSwapRequestId = useUiStore.use.selectedSwapRequestId();
  const { canSwitchNetworkTo, connect } = useWallets();
  const retry = useBestRouteStore.use.retry();
  const navigate = useNavigate();
  const { navigateBackFrom } = useNavigateBack();
  const [isCopied, handleCopy] = useCopyToClipboard(2000);
  const { manager } = useManager();

  const pendingSwaps = getPendingSwaps(manager);
  const selectedSwap = pendingSwaps.find(
    ({ swap }) => swap.requestId === selectedSwapRequestId
  );

  const onCancel = () => {
    const swap = manager?.get(selectedSwap?.id!);
    if (swap) cancelSwap(swap);
  };

  const swap = selectedSwap?.swap;
  if (!swap) return null;

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

  const lastConvertedTokenInFailedSwap = getLastConvertedTokenInFailedSwap(
    swap
  );

  return (
    <SwapHistory
      onBack={navigateBackFrom.bind(null, navigationRoutes.swapDetails)}
      //todo: move PendingSwap type to rango-types
      //@ts-ignore
      pendingSwap={swap}
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
