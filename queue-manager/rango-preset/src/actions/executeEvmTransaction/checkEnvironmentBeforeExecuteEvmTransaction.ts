import type {
  SwapActionTypes,
  SwapQueueContext,
  SwapStorage,
} from '../../types';
import type {
  BlockedReason,
  ExecuterActions,
} from '@rango-dev/queue-manager-core';

import { PendingSwapNetworkStatus } from 'rango-types';
import { Err, Ok, type Result } from 'ts-results';

import {
  ERROR_MESSAGE_DEPENDS_ON_OTHER_QUEUES,
  ERROR_MESSAGE_WAIT_FOR_CHANGE_NETWORK,
} from '../../constants';
import {
  claimQueue,
  getCurrentStep,
  getRequiredSignNetwork,
  isNeedBlockQueueForParallel,
  isNetworkMatchedForTransaction,
  updateNetworkStatus,
} from '../../helpers';
import { getCurrentNamespaceOf } from '../../shared';
import { BlockReason } from '../../types';
import { checkEnvironmentBeforeExecuteTransaction } from '../common/checkEnvironmentBeforeExecuteTransaction';
import { isClaimedByCurrentQueue } from '../common/utils';

/**
 * The checks an EVM transaction needs before it's sent to the wallet: the
 * wallet is connected with the right address, it's on the transaction's
 * network, and no other queue is using the wallet (in parallel mode).
 */
export async function checkEnvironmentBeforeExecuteEvmTransaction(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
): Promise<Result<true, BlockedReason>> {
  const { getStorage, context } = actions;

  const swap = getStorage().swapDetails;

  const currentStep = getCurrentStep(swap)!;

  /* Make sure wallet is connected and also the connected wallet is matched with tx by checking address. */
  const addressCheckResult = checkEnvironmentBeforeExecuteTransaction(actions);
  if (addressCheckResult.err) {
    return addressCheckResult;
  }

  /* Wallet should be on correct network */
  const networkResult = await ensureWalletIsOnCorrectNetwork(actions);
  if (networkResult.err) {
    return networkResult;
  }

  if (currentStep.networkStatus === PendingSwapNetworkStatus.NetworkChanged) {
    // Considering that network is matched now, if currently network status of the current step is equal to `NetworkChanged`, we need to update the network status to mark it as network changed successfully.
    updateNetworkStatus(actions, {
      message: '',
      details: 'The network has been successfully changed.',
      status: PendingSwapNetworkStatus.NetworkChanged,
    });
  }

  /*
   *For avoiding conflict by making too many requests to wallet, we need to make sure
   *We only run one request at a time (In parallel mode).
   */
  const needsToBlockQueue = isNeedBlockQueueForParallel(currentStep);
  const isClaimed = isClaimedByCurrentQueue(context);
  if (needsToBlockQueue && !isClaimed) {
    const blockedFor = {
      reason: BlockReason.DEPENDS_ON_OTHER_QUEUES,
      description: ERROR_MESSAGE_DEPENDS_ON_OTHER_QUEUES,
      details: {},
    };
    return new Err(blockedFor);
  }

  return new Ok(true);
}

async function ensureWalletIsOnCorrectNetwork(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
): Promise<Result<true, BlockedReason>> {
  const { getStorage, context } = actions;
  const { meta, wallets, hubProvider } = context;
  const swap = getStorage().swapDetails;
  const currentStep = getCurrentStep(swap)!;

  const networkMatched = await isNetworkMatchedForTransaction(
    swap,
    currentStep,
    wallets,
    meta,
    hubProvider
  );

  const { claimedBy } = claimQueue();
  const claimerId = claimedBy();
  const isClaimedByAnyQueue = !!claimerId && !isClaimedByCurrentQueue(context);

  if (isClaimedByAnyQueue && !networkMatched) {
    const details = ERROR_MESSAGE_DEPENDS_ON_OTHER_QUEUES;

    const blockedFor = {
      reason: BlockReason.DEPENDS_ON_OTHER_QUEUES,
      details: details,
    };
    return new Err(blockedFor);
  } else if (!networkMatched) {
    const fromNamespace = getCurrentNamespaceOf(swap, currentStep);
    const details = ERROR_MESSAGE_WAIT_FOR_CHANGE_NETWORK(
      getRequiredSignNetwork(currentStep, fromNamespace.network)
    );

    const blockedFor = {
      reason: BlockReason.WAIT_FOR_NETWORK_CHANGE,
      details: details,
    };
    return new Err(blockedFor);
  }

  return new Ok(true);
}
