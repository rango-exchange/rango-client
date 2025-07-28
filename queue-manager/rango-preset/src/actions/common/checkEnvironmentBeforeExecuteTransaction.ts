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
  ERROR_MESSAGE_WAIT_FOR_WALLET_DESCRIPTION,
  ERROR_MESSAGE_WAIT_FOR_WALLET_DESCRIPTION_WRONG_WALLET,
} from '../../constants';
import {
  claimQueue,
  getCurrentStep,
  getRequiredWallet,
  isNeedBlockQueueForParallel,
  isNetworkMatchedForTransaction,
  isRequiredWalletConnected,
  isWalletNull,
  resetNetworkStatus,
  updateNetworkStatus,
} from '../../helpers';
import { getCurrentNamespaceOf } from '../../shared';
import { BlockReason } from '../../types';

import { isClaimedByCurrentQueue } from './utils';

/**
 * Check for network & address be matched and queue to not be blocked and update the swap accordingly.
 */
export async function checkEnvironmentBeforeExecuteTransaction(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
): Promise<Result<true, BlockedReason>> {
  const { getStorage, context } = actions;

  const swap = getStorage().swapDetails;

  const currentStep = getCurrentStep(swap)!;

  // Resetting network status, so we will set it again during the running of this task.
  resetNetworkStatus(actions);

  /* Make sure wallet is connected and also the connected wallet is matched with tx by checking address. */
  const addressCheckResult = ensureRequriedWalletIsConnected(actions);
  if (addressCheckResult.err) {
    return addressCheckResult;
  }

  /* Wallet should be on correct network */
  const networkResult = await ensureWalletIsOnCorrectNetwork(actions);
  if (networkResult.err) {
    return networkResult;
  }

  // Update network to mark it as network changed successfully.
  updateNetworkStatus(actions, {
    message: '',
    details: 'Wallet network changed successfully',
    status: PendingSwapNetworkStatus.NetworkChanged,
  });

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

function ensureRequriedWalletIsConnected(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
): Result<true, BlockedReason> {
  const { getStorage, context } = actions;
  const { wallets } = context;
  const swap = getStorage().swapDetails;

  const isWrongAddress = !isRequiredWalletConnected(swap, context.state).ok;
  if (isWrongAddress) {
    const { type, address } = getRequiredWallet(swap);
    const isWalletInCompatible = wallets?.blockchains?.find(
      (w) => !w.accounts?.find((account) => account.walletType === type)
    );
    const description =
      isWalletNull(wallets) || isWalletInCompatible
        ? ERROR_MESSAGE_WAIT_FOR_WALLET_DESCRIPTION(type)
        : ERROR_MESSAGE_WAIT_FOR_WALLET_DESCRIPTION_WRONG_WALLET(type, address);

    const blockedFor = {
      reason: BlockReason.WAIT_FOR_CONNECT_WALLET,
      description,
    };
    return new Err(blockedFor);
  }

  return new Ok(true);
}

async function ensureWalletIsOnCorrectNetwork(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
): Promise<Result<true, BlockedReason>> {
  const { getStorage, context } = actions;
  const { meta, wallets, providers } = context;
  const swap = getStorage().swapDetails;
  const currentStep = getCurrentStep(swap)!;

  const networkMatched = await isNetworkMatchedForTransaction(
    swap,
    currentStep,
    wallets,
    meta,
    providers
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
      fromNamespace.network
    );

    const blockedFor = {
      reason: BlockReason.WAIT_FOR_NETWORK_CHANGE,
      details: details,
    };
    return new Err(blockedFor);
  }

  return new Ok(true);
}
