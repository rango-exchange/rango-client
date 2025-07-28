import type { SwapActionTypes, SwapQueueContext, SwapStorage } from '../types';
import type { ExecuterActions } from '@rango-dev/queue-manager-core';

import { PendingSwapNetworkStatus } from 'rango-types';

import {
  ERROR_MESSAGE_DEPENDS_ON_OTHER_QUEUES,
  ERROR_MESSAGE_WAIT_FOR_CHANGE_NETWORK,
  ERROR_MESSAGE_WAIT_FOR_WALLET_DESCRIPTION,
  ERROR_MESSAGE_WAIT_FOR_WALLET_DESCRIPTION_WRONG_WALLET,
} from '../constants';
import {
  claimQueue,
  getCurrentStep,
  getRequiredWallet,
  isNeedBlockQueueForParallel,
  isNetworkMatchedForTransaction,
  isRequiredWalletConnected,
  isWalletNull,
  signTransaction,
  updateNetworkStatus,
} from '../helpers';
import { getCurrentNamespaceOf } from '../shared';
import { BlockReason } from '../types';

/**
 * Excecute a created transaction.
 *
 * This function implemented the parallel mode by `claim` mechanism which means
 * All the queues the meet certain situation (like multiple evm transaction) will go through
 * a `claim` mechanims that decides which queue should be run and it blocks other ones.
 *
 * A queue will be go to sign process, if the wallet and network is matched.
 */
export async function executeTransaction(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
): Promise<void> {
  const { getStorage, context } = actions;
  const { meta, wallets, providers } = context;
  const { claimedBy } = claimQueue();

  const isClaimed = context.claimedBy === context._queue?.id;
  const requestBlock: typeof actions.block = (blockedFor) => {
    actions.block(blockedFor);
    if (isClaimed && actions.context.resetClaimedBy) {
      actions.context.resetClaimedBy();
    }
  };

  const swap = getStorage().swapDetails;

  const currentStep = getCurrentStep(swap)!;

  /* Make sure wallet is connected and also the connected wallet is matched with tx by checking address. */
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
    requestBlock(blockedFor);
    return;
  }

  /* Wallet should be on correct network */
  const networkMatched = await isNetworkMatchedForTransaction(
    swap,
    currentStep,
    wallets,
    meta,
    providers
  );
  const claimerId = claimedBy();
  const isClaimedByAnyQueue = !!claimerId && !isClaimed;
  if (isClaimedByAnyQueue && !networkMatched) {
    const details = ERROR_MESSAGE_DEPENDS_ON_OTHER_QUEUES;

    const blockedFor = {
      reason: BlockReason.DEPENDS_ON_OTHER_QUEUES,
      details: details,
    };
    requestBlock(blockedFor);
    return;
  } else if (!networkMatched) {
    const fromNamespace = getCurrentNamespaceOf(swap, currentStep);
    const details = ERROR_MESSAGE_WAIT_FOR_CHANGE_NETWORK(
      fromNamespace.network
    );

    const blockedFor = {
      reason: BlockReason.WAIT_FOR_NETWORK_CHANGE,
      details: details,
    };
    requestBlock(blockedFor);
    return;
  }
  // Update network to mark it as network changed successfully.
  updateNetworkStatus(actions, {
    message: '',
    details: 'The network has been successfully changed.',
    status: PendingSwapNetworkStatus.NetworkChanged,
  });

  /*
   *For avoiding conflict by making too many requests to wallet, we need to make sure
   *We only run one request at a time (In parallel mode).
   */
  const needsToBlockQueue = isNeedBlockQueueForParallel(currentStep);

  if (needsToBlockQueue && !isClaimed) {
    const blockedFor = {
      reason: BlockReason.DEPENDS_ON_OTHER_QUEUES,
      description: ERROR_MESSAGE_DEPENDS_ON_OTHER_QUEUES,
      details: {},
    };
    requestBlock(blockedFor);
    return;
  }

  // All the conditions are met. We can safely send the tx to wallet for sign.
  await signTransaction(actions);
}
