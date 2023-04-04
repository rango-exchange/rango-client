import React from 'react';
import { useManager } from '@rango-dev/queue-manager-react';
import { SwapHistory } from '@rango-dev/ui';
import { navigationRoutes } from '../constants/navigationRoutes';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { getPendingSwaps } from '../utils/queue';
import { useUiStore } from '../store/ui';
import useCopyToClipboard from '../hooks/useCopyToClipboard';

export function SwapDetailsPage() {
  const selectedSwapRequestId = useUiStore.use.selectedSwapRequestId();
  const { navigateBackFrom } = useNavigateBack();
  const { manager } = useManager();
  const [isCopied, handleCopy] = useCopyToClipboard(2000);

  const pendingSwaps = getPendingSwaps(manager);
  const selectedSwap = pendingSwaps.find(
    ({ swap }) => swap.requestId === selectedSwapRequestId
  )?.swap;

  return (
    <SwapHistory
      onBack={navigateBackFrom.bind(null, navigationRoutes.swapDetails)}
      //todo: move PendingSwap type to rango-types
      //@ts-ignore
      pendingSwap={selectedSwap}
      onCopy={handleCopy}
      isCopied={isCopied}
      //todo: implement swap cancellation (move queueManager logic to queueManager/rango-preset)
      onCancel={(requestId) => console.log(requestId)}
    />
  );
}
