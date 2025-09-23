import type {
  SwapActionTypes,
  SwapQueueContext,
  SwapStorage,
} from '../../types';
import type {
  BlockedReason,
  ExecuterActions,
} from '@rango-dev/queue-manager-core';

export function isClaimedByCurrentQueue(context: SwapQueueContext): boolean {
  return context.claimedBy === context._queue?.id;
}

export function requestBlockQueue(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>,
  blockedFor: BlockedReason
) {
  actions.block(blockedFor);

  const isClaimed = isClaimedByCurrentQueue(actions.context);
  if (isClaimed && actions.context.resetClaimedBy) {
    actions.context.resetClaimedBy();
  }
}
