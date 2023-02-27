import {
  PendingSwap,
  MessageSeverity,
  PendingSwapNetworkStatus,
  StepStatus,
  SwapStatus,
  EventType,
  Wallet,
  PendingSwapStep,
  WalletTypeAndAddress,
  SwapProgressNotification,
} from "../rango/types";
import { ExecuterActions } from "@rango-dev/queue-manager-core";
import {
  BlockReason,
  SwapActionTypes,
  SwapQueueContext,
  SwapStorage,
} from "./types";
import {
  CosmosTransaction,
  EvmTransaction,
  TransactionType,
  getBlockChainNameFromId,
  Meta,
  Network,
  SolanaTransaction,
  Transaction,
  TransferTransaction,
  WalletState,
  WalletType,
} from "@rango-dev/wallets-shared";
import {
  getCurrentBlockchainOf,
  getCurrentBlockchainOfOrNull,
  getEvmApproveUrl,
  logRPCError,
  prettifyErrorMessage,
  PrettyError,
} from "../rango/helpers";
import { Providers, readAccountAddress } from "@rango-dev/wallets-core";
import { SwapQueueDef } from "./queueDef";

type WhenTaskBlocked = Parameters<NonNullable<SwapQueueDef["whenTaskBlocked"]>>;
type WhenTaskBlockedEvent = WhenTaskBlocked[0];
type WhenTaskBlockedMeta = WhenTaskBlocked[1];

export const getCurrentStep = (swap: PendingSwap) => {
  return (
    swap.steps.find(
      (step) => step.status !== "failed" && step.status !== "success"
    ) || null
  );
};

export function updateSwapStatus({
  getStorage,
  setStorage,
  nextStatus,
  nextStepStatus,
  message,
  details,
}: {
  getStorage: ExecuterActions<
    SwapStorage,
    SwapActionTypes,
    SwapQueueContext
  >["getStorage"];
  setStorage: ExecuterActions<
    SwapStorage,
    SwapActionTypes,
    SwapQueueContext
  >["setStorage"];
  nextStatus: SwapStatus | null;
  nextStepStatus: StepStatus | null;
  message: string | null;
  details: string | null | undefined;
}) {
  const swap = getStorage().swapDetails;
  const currentStep = getCurrentStep(swap);
  if (!!nextStepStatus && !!currentStep) currentStep.status = nextStepStatus;

  if (!!nextStatus) swap.status = nextStatus;

  if (!!nextStatus && ["failed", "success"].includes(nextStatus))
    swap.finishTime = new Date().getTime().toString();

  if (!!message) swap.extraMessage = message;

  if (!!details) swap.extraMessageDetail = details;

  if (!!nextStepStatus && ["failed"].includes(nextStepStatus))
    swap.extraMessageSeverity = MessageSeverity.error;
  else if (!!nextStepStatus && ["running"].includes(nextStepStatus))
    swap.extraMessageSeverity = MessageSeverity.info;
  else if (!!nextStepStatus && ["success", "approved"].includes(nextStepStatus))
    swap.extraMessageSeverity = MessageSeverity.success;
  else if (nextStepStatus && ["waitingForApproval"].includes(nextStepStatus))
    swap.extraMessageSeverity = MessageSeverity.warning;

  if (nextStepStatus === "running" && currentStep)
    currentStep.startTransactionTime = new Date().getTime();

  setStorage({
    ...getStorage(),
    swapDetails: swap,
  });

  return {
    swap,
    step: currentStep,
  };
}

export function notifier({ eventType, swap, step }: SwapProgressNotification) {
  console.log("[notifier]", { eventType, swap, step });
}

// export function changeStatusAndNotify(
//   { getStorage, setStorage }: ExecuterActions<SwapStorage, SwapActionTypes>,
//   swapStatus: SwapStatus | null,
//   stepStatus: StepStatus | null,
//   extraMessage: string | null,
//   extraMessageDetail: string | null | undefined,
//   extraMessageErrorCode: string | null,
//   eventType: EventType,
//   swapUpdateCallback: SwapUpdateCallback
// )

export function setStepTransactionIds(
  { getStorage, setStorage }: ExecuterActions<SwapStorage, SwapActionTypes>,
  txId: string | null,
  externalTxId: string | null,
  eventType: EventType,
  notifier: SwapQueueContext["notifier"]
) {
  const swap = getStorage().swapDetails;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentStep = getCurrentStep(swap)!;
  currentStep.executedTransactionId = txId || currentStep.executedTransactionId;
  setStorage({
    ...getStorage(),
    swapDetails: swap,
  });
  notifier({ eventType: eventType, swap: swap, step: currentStep });
}

export function markRunningSwapAsWaitingForConnectingWallet(
  {
    getStorage,
    setStorage,
  }: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>,
  reason: string,
  reasonDetail: string
): void {
  const swap = getStorage().swapDetails;
  const currentStep = getCurrentStep(swap);
  if (!currentStep) return;
  const currentTime = new Date();
  swap.lastNotificationTime = currentTime.getTime().toString();

  // TODO: Do we need this?
  if (
    currentStep.networkStatus ===
    PendingSwapNetworkStatus.WaitingForConnectingWallet
  ) {
    setStorage({
      ...getStorage(),
      swapDetails: swap,
    });
  }

  const isAlreadyMarked =
    currentStep.networkStatus ===
      PendingSwapNetworkStatus.WaitingForConnectingWallet &&
    swap.networkStatusExtraMessage === reason &&
    swap.networkStatusExtraMessageDetail === reasonDetail;
  if (isAlreadyMarked) {
    return;
  }

  currentStep.networkStatus =
    PendingSwapNetworkStatus.WaitingForConnectingWallet;
  swap.networkStatusExtraMessage = reason;
  swap.networkStatusExtraMessageDetail = reasonDetail;

  setStorage({
    ...getStorage(),
    swapDetails: swap,
  });
}

export function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export const isEvmTransaction = (tx: Transaction): tx is EvmTransaction =>
  tx.type === TransactionType.EVM;
export const isCosmosTransaction = (tx: Transaction): tx is CosmosTransaction =>
  tx.type === TransactionType.COSMOS;
export const isSolanaTransaction = (tx: Transaction): tx is SolanaTransaction =>
  tx.type === TransactionType.SOLANA;
export const isTrasnferTransaction = (
  tx: Transaction
): tx is TransferTransaction => tx.type === TransactionType.TRANSFER;

export const getSwapWalletType = (
  swap: PendingSwap,
  network: Network
): WalletType => {
  return swap.wallets[network]?.walletType;
};

export function isWalletNull(wallet: Wallet | null): boolean {
  return (
    wallet === null ||
    wallet?.blockchains === null ||
    wallet?.blockchains.length === 0
  );
}

export function getEvmProvider(providers: Providers, type: WalletType) {
  if (type && providers[type]) {
    // we need this because provider can return an instance or a map of instances, so what you are doing here is try to detect that.
    if (providers[type].size) return providers[type].get(Network.ETHEREUM);

    return providers[type];
  }
  return null;
}

export function getRequiredWallet(swap: PendingSwap) {
  const step = getCurrentStep(swap)!;
  const bcName = getCurrentBlockchainOfOrNull(swap, step);
  if (!bcName) {
    return {
      type: null,
      network: null,
      address: null,
    };
  }

  const walletType = getSwapWalletType(swap, bcName);
  const sourceWallet = swap.wallets[bcName];

  return {
    type: walletType || null,
    network: bcName,
    address: sourceWallet ? sourceWallet.address : null,
  };
}

async function getChainId(provider: any) {
  const chainId: number | string | null =
    (await provider.request({ method: "eth_chainId" })) || provider?.chainId;
  return chainId;
}

export async function isNetworkMatchedForTransaction(
  swap: PendingSwap,
  step: PendingSwapStep,
  wallet: Wallet | null,
  meta: Meta,
  providers: Providers
): Promise<boolean> {
  if (!wallet || isWalletNull(wallet)) {
    console.warn("wallet object is null");
    return false;
  }
  const fromBlockChain = getCurrentBlockchainOfOrNull(swap, step);
  if (!fromBlockChain) return false;

  if (
    !!meta.evmBasedChains.find(
      (evmBlochain) => evmBlochain.name === fromBlockChain
    )
  ) {
    try {
      const sourceWallet = swap.wallets[fromBlockChain];
      if (sourceWallet) {
        if (
          [
            WalletType.META_MASK,
            WalletType.BINANCE_CHAIN,
            WalletType.XDEFI,
            WalletType.WALLET_CONNECT,
            WalletType.TRUST_WALLET,
            WalletType.COIN98,
            WalletType.EXODUS,
            WalletType.OKX,
            WalletType.COINBASE,
            WalletType.TOKEN_POCKET,
            WalletType.MATH,
            WalletType.SAFEPAL,
            WalletType.COSMOSTATION,
            WalletType.CLOVER,
            WalletType.BRAVE,
          ].includes(sourceWallet.walletType)
        ) {
          const provider = getEvmProvider(providers, sourceWallet.walletType);
          const chainId: number | string | null = await getChainId(provider);
          if (chainId) {
            const blockChain = getBlockChainNameFromId(
              chainId,
              Object.entries(meta.blockchains).map(
                ([, blockchainMeta]) => blockchainMeta
              )
            );
            if (
              blockChain &&
              blockChain.toLowerCase() === fromBlockChain.toLowerCase()
            )
              return true;
            if (
              blockChain &&
              blockChain.toLowerCase() !== fromBlockChain.toLowerCase()
            )
              return false;
          }
        } else {
          return true;
        }
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  }
  return true;
}

export const getCurrentAddressOf = (
  swap: PendingSwap,
  step: PendingSwapStep
): string => {
  const result =
    swap.wallets[step.evmTransaction?.blockChain || ""] ||
    swap.wallets[step.evmApprovalTransaction?.blockChain || ""] ||
    swap.wallets[step.cosmosTransaction?.blockChain || ""] ||
    swap.wallets[step.solanaTransaction?.blockChain || ""] ||
    (step.transferTransaction?.fromWalletAddress
      ? { address: step.transferTransaction?.fromWalletAddress }
      : null) ||
    null;
  if (result == null) throw PrettyError.WalletMissing();
  return result.address;
};

export function getRelatedWallet(
  swap: PendingSwap,
  currentStep: PendingSwapStep
): WalletTypeAndAddress {
  const walletAddress = getCurrentAddressOf(swap, currentStep);
  const walletKV =
    Object.keys(swap.wallets)
      .map((k) => ({ k, v: swap.wallets[k] }))
      .find(({ v }) => v.address === walletAddress) || null;
  const blockchain = walletKV?.k || null;
  const wallet = walletKV?.v || null;

  const walletType = wallet?.walletType;
  if (walletType === WalletType.UNKNOWN || wallet === null)
    throw PrettyError.AssertionFailed(
      `Wallet for source ${blockchain} not passed to transfer: walletType: ${walletType}`
    );
  return wallet;
}

export const isTxAlreadyCreated = (
  swap: PendingSwap,
  step: PendingSwapStep
): boolean => {
  const result =
    swap.wallets[step.evmTransaction?.blockChain || ""] ||
    swap.wallets[step.evmApprovalTransaction?.blockChain || ""] ||
    swap.wallets[step.cosmosTransaction?.blockChain || ""] ||
    swap.wallets[step.solanaTransaction?.blockChain || ""] ||
    step.transferTransaction?.fromWalletAddress ||
    null;

  return result !== null;
};

export function onBlockForConnectWallet(event, queue_ref, context) {
  const swap = queue_ref.getStorage().swapDetails;

  if (!isRequiredWalletConnected(swap, context.state)) {
    console.log("Please connect requried wallet.");
    return;
  }

  queue_ref.unblock();
  console.log("wallet should be connected now.");
}

export function onBlockForChangeNetwork(event, queue_ref, context) {
  const swapDetails = queue_ref.getStorage().swapDetails;
  const { type, network } = getRequiredWallet(swapDetails);

  if (!!type && !!network) {
    console.log("try to switch network...", {
      type,
      network,
      switchN: context.switchNetwork,
    });
    const result = context.switchNetwork(type, network);
    if (result) {
      result.then(() => {
        queue_ref.unblock();
      });
    }
  } else {
    console.log("wallet not found");
  }
}

export function onDependsOnOtherQueues(
  ـevent: WhenTaskBlockedEvent,
  meta: WhenTaskBlockedMeta
) {
  const { getBlockedTasks, forceRun, context, retry } = meta;

  // We only needs those blocked tasks that have DEPENDS_ON_OTHER_QUEUES reason.
  const blockedTasks = getBlockedTasks().filter(
    (task) => task.reason.reason === BlockReason.DEPENDS_ON_OTHER_QUEUES
  );

  console.log("onDependsOnOtherQueues, blockedTasks", context._queue);

  if (blockedTasks.length === 0) {
    return;
  }

  // Check if any queue `claimed` before, if yes, we don't should do anything.
  const isAlreadyClaimed = !!context.claimedBy;

  console.log(
    "onDependsOnOtherQueues, isAlreadyClaimed",
    isAlreadyClaimed,
    context.claimedBy
  );

  if (isAlreadyClaimed) {
    return;
  }

  // Prioritize current queue to be run first.

  let task = blockedTasks.find((task) => {
    return task.queue_id === meta.queue_id;
  });

  // If current task isn't available anymore, fallback to first blocked task.
  if (!task) {
    const firstBlockedTask = blockedTasks[0];

    // if there is no more remaining task, exit.
    if (firstBlockedTask) {
      return;
    }

    task = firstBlockedTask;
  }

  console.log(task);

  // Run
  forceRun(task.queue_id, {
    claimedBy: task.queue_id,
    resetClaimedBy: () => {
      retry();
    },
  });
}

export function isRequiredWalletConnected(
  swap: PendingSwap,
  getState: (type: WalletType) => WalletState
) {
  const { type, address } = getRequiredWallet(swap);
  if (!type || !address) {
    return false;
  }
  const walletState = getState(type);
  const { accounts } = walletState;
  const connectedAccounts = accounts || [];

  return connectedAccounts.some((account) => {
    const { address: accountAddress } = readAccountAddress(account);
    return address === accountAddress;
  });
}

export function singTransaction(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
) {
  const { getStorage, setStorage, failed, next, schedule, context } = actions;
  const { meta, getSigners, notifier } = context;
  const swap = getStorage().swapDetails;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentStep = getCurrentStep(swap)!;
  const {
    evmTransaction,
    evmApprovalTransaction,
    cosmosTransaction,
    solanaTransaction,
    transferTransaction,
  } = currentStep;
  const sourceWallet = getRelatedWallet(swap, currentStep);
  const walletSigners = getSigners(sourceWallet.walletType);
  const needsApproval = !!evmApprovalTransaction;
  const onFinish = () => {
    if (actions.context.resetClaimedBy) {
      actions.context.resetClaimedBy();
    }
  };

  if (needsApproval) {
    const spenderContract = evmApprovalTransaction.to;

    if (!spenderContract)
      throw PrettyError.AssertionFailed(
        "contract address is null for checking approval"
      );

    // Update swap status
    const message = `waiting for approval of ${currentStep?.fromSymbol} coin ${
      sourceWallet.walletType === WalletType.WALLET_CONNECT
        ? "on your mobile phone"
        : ""
    }`;
    const updateResult = updateSwapStatus({
      getStorage,
      setStorage,
      nextStatus: null,
      nextStepStatus: "waitingForApproval",
      message,
      details:
        "Waiting for approve transaction to be mined and confirmed successfully",
    });
    notifier({
      eventType: "confirm_contract",
      ...updateResult,
    });

    // Execute transaction
    walletSigners.executeEvmTransaction(evmApprovalTransaction, meta).then(
      (hash) => {
        console.debug("transaction of approval minted successfully", hash);
        const approveUrl = getEvmApproveUrl(
          hash,
          getCurrentBlockchainOf(swap, currentStep),
          meta.evmBasedChains
        );
        currentStep.explorerUrl = [
          ...(currentStep.explorerUrl || []),
          {
            url: approveUrl,
            description: `approve`,
          },
        ];

        // `currentStep` has been mutated, let's update storage.
        setStorage({
          ...getStorage(),
          swapDetails: swap,
        });
        schedule(SwapActionTypes.CHECK_TRANSACTION_STATUS);
        next();
        onFinish();
      },

      (error) => {
        if (swap.status === "failed") return;
        console.debug("error in approving", error);
        const prettyError = prettifyErrorMessage(error);
        let { extraMessage } = prettyError;
        const { extraMessageDetail } = prettyError;
        if (
          error &&
          error?.root &&
          error?.root?.message &&
          error?.root?.code &&
          error?.root?.reason
        ) {
          extraMessage = `${error.message}, code: ${error?.root?.code}, reason: ${error?.root?.reason}`;
          logRPCError(error.root, swap, currentStep, sourceWallet?.walletType);
        }

        const updateResult = updateSwapStatus({
          getStorage,
          setStorage,
          nextStatus: "failed",
          nextStepStatus: "failed",
          message: extraMessage,
          details: extraMessageDetail,
        });
        notifier({
          eventType: "contract_rejected",
          ...updateResult,
        });

        failed();
        onFinish();
      }
    );
    return;
  }

  const executeMessage = "executing transaction";
  const executeDetails = `${
    sourceWallet.walletType === WalletType.WALLET_CONNECT
      ? "Check your mobile phone"
      : ""
  }`;

  if (!!transferTransaction) {
    const updateResult = updateSwapStatus({
      getStorage,
      setStorage,
      nextStatus: null,
      nextStepStatus: "running",
      message: executeMessage,
      details: executeDetails,
    });
    notifier({
      eventType: "confirm_transfer",
      ...updateResult,
    });

    const tx = transferTransaction;

    walletSigners.executeTransfer(transferTransaction, meta).then(
      (txId) => {
        setStepTransactionIds(
          actions,
          txId,
          tx.externalTxId,
          "transfer_confirmed",
          notifier
        );
        schedule(SwapActionTypes.CHECK_TRANSACTION_STATUS);
        next();
        onFinish();
      },
      (error) => {
        if (swap.status === "failed") return;
        const { extraMessage, extraMessageDetail } =
          prettifyErrorMessage(error);

        const updateResult = updateSwapStatus({
          getStorage,
          setStorage,
          nextStatus: "failed",
          nextStepStatus: "failed",
          message: extraMessage,
          details: extraMessageDetail,
        });
        notifier({
          eventType: "transfer_rejected",
          ...updateResult,
        });
        failed();
        onFinish();
      }
    );
  } else if (!!evmTransaction) {
    const updateResult = updateSwapStatus({
      getStorage,
      setStorage,
      nextStatus: null,
      nextStepStatus: "running",
      message: executeMessage,
      details: executeDetails,
    });
    notifier({
      eventType: "calling_smart_contract",
      ...updateResult,
    });

    const tx = evmTransaction;

    console.log({ evmTransaction });
    walletSigners.executeEvmTransaction(evmTransaction, meta).then(
      (id) => {
        console.log("[executeEvmTransaction]", { tx, id });

        setStepTransactionIds(
          actions,
          id,
          tx.externalTxId,
          "smart_contract_called",
          notifier
        );
        schedule(SwapActionTypes.CHECK_TRANSACTION_STATUS);
        next();
        onFinish();
      },
      (error) => {
        if (swap.status === "failed") return;
        const httpErrorMessage = error?.response?.data?.message;
        const prettyError = prettifyErrorMessage(httpErrorMessage || error);
        const { extraMessageDetail } = prettyError;
        let { extraMessage } = prettyError;
        if (
          error &&
          error?.root &&
          error?.root?.message &&
          error?.root?.code &&
          error?.root?.reason
        ) {
          extraMessage = `${error.message}, code: ${error?.root?.code}, reason: ${error?.root?.reason}`;
          logRPCError(error.root, swap, currentStep, sourceWallet?.walletType);
        }
        const updateResult = updateSwapStatus({
          getStorage,
          setStorage,
          nextStatus: "failed",
          nextStepStatus: "failed",
          message: extraMessage,
          details: extraMessageDetail,
        });
        notifier({
          eventType: "smart_contract_call_failed",
          ...updateResult,
        });

        failed();
        onFinish();
      }
    );
  } else if (!!cosmosTransaction) {
    const updateResult = updateSwapStatus({
      getStorage,
      setStorage,
      nextStatus: null,
      nextStepStatus: "running",
      message: executeMessage,
      details: executeDetails,
    });
    notifier({
      eventType: "calling_smart_contract",
      ...updateResult,
    });

    const tx = cosmosTransaction;
    // If keplr wallet is executing contracts on terra, throw error. keplr doesn't support transfer or execute contracts. only IBC messages are supported
    if (
      (currentStep?.swapperId.toString() === "TerraSwap" ||
        (currentStep?.swapperId.toString() === "ThorChain" &&
          currentStep?.fromBlockchain === Network.TERRA) ||
        (currentStep?.swapperId.toString() === "Terra Bridge" &&
          currentStep.fromBlockchain === Network.TERRA)) && // here we must allow ibc on terrastatus
      sourceWallet.walletType === WalletType.KEPLR
    ) {
      const { extraMessage, extraMessageDetail } = prettifyErrorMessage(
        "Keplr only supports IBC Transactions on Terra. " +
          "Using Terra Bridge, TerraSwap and THORChain is not possible with Keplr. Please use TerraStation or Leap wallet"
      );
      const updateResult = updateSwapStatus({
        getStorage,
        setStorage,
        nextStatus: "failed",
        nextStepStatus: "failed",
        message: extraMessage,
        details: extraMessageDetail,
      });
      notifier({
        eventType: "smart_contract_call_failed",
        ...updateResult,
      });
      failed();
      onFinish();
      return;
    }

    walletSigners.executeCosmosMessage(cosmosTransaction, meta).then(
      // todo
      (id: string | null) => {
        setStepTransactionIds(
          actions,
          id,
          tx.externalTxId,
          "smart_contract_called",
          notifier
        );
        schedule(SwapActionTypes.CHECK_TRANSACTION_STATUS);
        next();
        onFinish();
      },
      (error: string | null) => {
        if (swap.status === "failed") return;
        const httpErrorMessage = error;
        const { extraMessage, extraMessageDetail } = prettifyErrorMessage(
          httpErrorMessage || error
        );
        const updateResult = updateSwapStatus({
          getStorage,
          setStorage,
          nextStatus: "failed",
          nextStepStatus: "failed",
          message: extraMessage,
          details: extraMessageDetail,
        });
        notifier({
          eventType: "smart_contract_call_failed",
          ...updateResult,
        });
        failed();
        onFinish();
      }
    );
  } else if (!!solanaTransaction) {
    const updateResult = updateSwapStatus({
      getStorage,
      setStorage,
      nextStatus: null,
      nextStepStatus: "running",
      message: executeMessage,
      details: executeDetails,
    });
    notifier({
      eventType: "calling_smart_contract",
      ...updateResult,
    });

    const tx = solanaTransaction;
    walletSigners.executeSolanaTransaction(tx, swap.requestId).then(
      (txId) => {
        setStepTransactionIds(
          actions,
          txId,
          tx.externalTxId,
          "smart_contract_called",
          notifier
        );
        schedule(SwapActionTypes.CHECK_TRANSACTION_STATUS);
        next();
        onFinish();
      },
      (error) => {
        if (swap.status === "failed") return;
        const { extraMessage, extraMessageDetail } =
          prettifyErrorMessage(error);
        const updateResult = updateSwapStatus({
          getStorage,
          setStorage,
          nextStatus: "failed",
          nextStepStatus: "failed",
          message: extraMessage,
          details: extraMessageDetail,
        });
        notifier({
          eventType: "smart_contract_call_failed",
          ...updateResult,
        });
        failed();
        onFinish();
      }
    );
  }
}
