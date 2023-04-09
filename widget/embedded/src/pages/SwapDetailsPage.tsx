import React from 'react';
import { navigationRoutes } from '../constants/navigationRoutes';
import useCopyToClipboard from '../hooks/useCopyToClipboard';
import { useManager } from '@rango-dev/queue-manager-react';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { getPendingSwaps } from '../utils/queue';
import { SwapHistory } from '@rango-dev/ui';
import { useUiStore } from '../store/ui';
import { cancelSwap } from '@rango-dev/queue-manager-rango-preset';

export function SwapDetailsPage() {
  const selectedSwapRequestId = useUiStore.use.selectedSwapRequestId();
  const { navigateBackFrom } = useNavigateBack();
  const { manager } = useManager();
  const [isCopied, handleCopy] = useCopyToClipboard(2000);

  const pendingSwaps = getPendingSwaps(manager);
  const selectedSwap = pendingSwaps.find(
    ({ swap }) => swap.requestId === selectedSwapRequestId
  );

  //TODO: implement swap cancellation (move queueManager logic to queueManager/rango-preset)
  const onCancel = () => {
    const swap = manager?.get(selectedSwap.id);
    if (swap) cancelSwap(swap);
  };
  return (
    <SwapHistory
      onBack={navigateBackFrom.bind(null, navigationRoutes.swapDetails)}
      //todo: move PendingSwap type to rango-types
      //@ts-ignore
      pendingSwap={selectedSwap?.swap}
      onCopy={handleCopy}
      isCopied={isCopied}
      onCancel={onCancel}
    />
  );
}
