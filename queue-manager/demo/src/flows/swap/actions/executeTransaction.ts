import { ExecuterActions } from "@rangodev/queue-manager-core";

import {
  getCurrentStep,
  isNetworkMatchedForTransaction,
  isRequiredWalletConnected,
  markRunningSwapAsWaitingForConnectingWallet,
  singTransaction,
} from "../helpers";
import {
  BlockReason,
  SwapActionTypes,
  SwapQueueContext,
  SwapStorage,
} from "../types";

export async function executeTransaction(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
) {
  console.log(
    "%cexecute transaction...",
    "color:#5fa425; background:white; font-size: 1.5rem"
  );
  const { getStorage, setStorage, context } = actions;
  const { meta, wallets, providers, notifier } = context;

  const swap = getStorage().swapDetails;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentStep = getCurrentStep(swap)!;

  // Todo: Is this really needed?
  if (currentStep.networkStatus) {
    currentStep.networkStatus = null;
    setStorage({ ...getStorage(), swapDetails: swap });
  }

  /* Make sure wallet is connected and also the connected wallet is matched with tx by checking address. */
  const isWrongWallet =
    !wallets || !isRequiredWalletConnected(swap, context.state);
  if (isWrongWallet) {
    notifier({
      eventType: "waiting_for_connecting_wallet",
      swap: swap,
      step: currentStep,
    });

    const blockedFor = {
      reason: BlockReason.WAIT_FOR_CONNECT_WALLET,
      description: "Use top right button to connect your wallet.",
      details: {},
    };
    markRunningSwapAsWaitingForConnectingWallet(
      actions,
      "Waiting for connecting wallet",
      blockedFor.description
    );
    actions.block(blockedFor);
    return;
  }

  /* 
  For avoiding conflict by making too many requests to wallet, we need to make sure
  We only run one request at a time (In parallel mode).
  */
  const needsToBlockQueue =
    !!currentStep.evmTransaction ||
    !!currentStep.evmApprovalTransaction ||
    currentStep.cosmosTransaction;
  const isClaimed = context.claimedBy === context._queue?.id;
  console.log(
    "needsToBlockQueue",
    isClaimed,
    context.claimedBy,
    context._queue
  );

  if (needsToBlockQueue && !isClaimed) {
    const blockedFor = {
      reason: BlockReason.DEPENDS_ON_OTHER_QUEUES,
      description: "Waiting for other running tasks to be finished",
      details: {},
    };
    actions.block(blockedFor);
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
  if (!networkMatched) {
    const blockedFor = {
      reason: BlockReason.WAIT_FOR_NETWORK_CHANGE,
      details: "Please change network in your wallet.",
    };

    actions.block(blockedFor);
    return;
  }

  console.log("start to sign...");
  // All the conditions are met. We can safely send the tx to wallet for sign.
  singTransaction(actions);
}
