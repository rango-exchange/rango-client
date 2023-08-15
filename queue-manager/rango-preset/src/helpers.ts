import {
  ExecuterActions,
  QueueInfo,
  QueueName,
  QueueType,
} from '@rango-dev/queue-manager-core';
import {
  ArrayElement,
  BlockReason,
  StepEventType,
  SwapActionTypes,
  SwapQueueContext,
  SwapQueueDef,
  SwapStorage,
  StepExecutionEventStatus,
  StepExecutionBlockedEventStatus,
  Step,
} from './types';
import {
  getBlockChainNameFromId,
  Meta,
  Network,
  Networks,
  WalletState,
  WalletType,
} from '@rango-dev/wallets-shared';
import { Providers, readAccountAddress } from '@rango-dev/wallets-react';

import {
  Transaction,
  TransactionType,
  EvmBlockchainMeta,
  CreateTransactionResponse,
} from 'rango-sdk';

import {
  DEFAULT_ERROR_CODE,
  ERROR_MESSAGE_WAIT_FOR_CHANGE_NETWORK,
  ERROR_MESSAGE_WAIT_FOR_WALLET,
  ERROR_MESSAGE_WAIT_FOR_WALLET_DESCRIPTION,
} from './constants';
import { Manager } from '@rango-dev/queue-manager-core';
import { Status } from '@rango-dev/queue-manager-core';
import {
  getCurrentBlockchainOf,
  getCurrentBlockchainOfOrNull,
  getScannerUrl,
  getRelatedWalletOrNull,
  MessageSeverity,
  PendingSwap,
  PendingSwapNetworkStatus,
  PendingSwapStep,
  StepStatus,
  SwapStatus,
  Wallet,
  getRelatedWallet,
  getCurrentAddressOf,
} from './shared';
import { logRPCError } from './shared-sentry';
import {
  PrettyError,
  mapAppErrorCodesToAPIErrorCode,
  prettifyErrorMessage,
} from './shared-errors';
import { httpService } from './services';
import { APIErrorCode, SignerErrorCode } from 'rango-types/lib';
import { notifier } from './services/eventEmitter';

type WhenTaskBlocked = Parameters<NonNullable<SwapQueueDef['whenTaskBlocked']>>;
type WhenTaskBlockedEvent = WhenTaskBlocked[0];
type WhenTaskBlockedMeta = WhenTaskBlocked[1];

let swapClaimedBy: { id: string } | null = null;

/**
 *
 * We simply use module-level variable to keep track of which queue has claimed the execution of parallel runnings.
 *
 */
export function claimQueue() {
  return {
    claimedBy: () => swapClaimedBy?.id,
    setClaimer: (queue_id: string) => {
      swapClaimedBy = {
        id: queue_id,
      };
    },
    reset: () => {
      swapClaimedBy = null;
    },
  };
}

/**
 *
 * We use module-level variable to keep track of
 * map of transactions hash to the TransactionResponse and ...
 *
 */
type TransactionData = {
  response?: any; // e.g. TransactionResponse in case of EVM transactions
  receiptReceived?: boolean; // e.g. is TransactionReceipt ready in case of EVM transactions
};
const swapTransactionToDataMap: { [id: string]: TransactionData } = {};
export function inMemoryTransactionsData() {
  return {
    getTransactionDataByHash: (hash: string) =>
      swapTransactionToDataMap[hash] || {},
    setTransactionDataByHash: (hash: string, data: TransactionData) => {
      const r = swapTransactionToDataMap[hash];
      if (!r) swapTransactionToDataMap[hash] = {};
      swapTransactionToDataMap[hash].response =
        data.response || swapTransactionToDataMap[hash].response;
      swapTransactionToDataMap[hash].receiptReceived =
        data.receiptReceived ||
        swapTransactionToDataMap[hash].receiptReceived ||
        false;
    },
  };
}

/**
 * Sample inputs are:
 *  - "metamask-ETH"
 *  - "metamask-BSC-BSC:0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
 *  - "token-pocket-BSC-BSC:0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
 * Returns "wallet and network" separately, even if the wallet is dashed inside.
 *
 */

export function splitWalletNetwork(input: string): string[] {
  const removedAddressInput = input?.split(':')[0] || '';
  const splittedInput = removedAddressInput.split('-');
  const network = splittedInput[splittedInput.length - 1];
  const walletNetwork = splittedInput.slice(0, -1);

  if (walletNetwork[walletNetwork.length - 1] === network) {
    walletNetwork.pop();
  }
  const wallet = walletNetwork.join('-');

  return [wallet, network];
}

/**
 *
 * Returns `steps`, if it's a `running` swap.
 * Each `PendingSwap` has a `steps` inside it, `steps` shows how many tasks should be created and run to finish the swap.
 *
 */
export const getCurrentStep = (swap: PendingSwap): PendingSwapStep | null => {
  return (
    swap.steps.find(
      (step) => step.status !== 'failed' && step.status !== 'success'
    ) || null
  );
};

/**
 *
 * Returns current step transaction
 *
 */
export const getCurrentStepTx = (
  currentStep: PendingSwapStep
): Transaction | null => {
  const {
    evmTransaction,
    evmApprovalTransaction,
    cosmosTransaction,
    solanaTransaction,
    transferTransaction,
    starknetApprovalTransaction,
    starknetTransaction,
    tronApprovalTransaction,
    tronTransaction,
    tonTransaction,
  } = currentStep;
  return (
    evmTransaction ||
    evmApprovalTransaction ||
    cosmosTransaction ||
    solanaTransaction ||
    transferTransaction ||
    starknetApprovalTransaction ||
    starknetTransaction ||
    tronApprovalTransaction ||
    tronTransaction ||
    tonTransaction
  );
};

/**
 *
 * Set current step transaction
 *
 */
export const setCurrentStepTx = (
  currentStep: PendingSwapStep,
  transaction: Transaction
): PendingSwapStep => {
  currentStep.transferTransaction = null;
  currentStep.cosmosTransaction = null;
  currentStep.evmTransaction = null;
  currentStep.solanaTransaction = null;
  currentStep.evmApprovalTransaction = null;
  currentStep.starknetApprovalTransaction = null;
  currentStep.starknetTransaction = null;
  currentStep.tronApprovalTransaction = null;
  currentStep.tronTransaction = null;
  currentStep.tonTransaction = null;

  const txType = transaction.type;
  switch (txType) {
    case TransactionType.EVM:
      if (transaction.isApprovalTx)
        currentStep.evmApprovalTransaction = transaction;
      else currentStep.evmTransaction = transaction;
      break;
    case TransactionType.TRON:
      if (transaction.isApprovalTx)
        currentStep.tronApprovalTransaction = transaction;
      else currentStep.tronTransaction = transaction;
      break;
    case TransactionType.STARKNET:
      if (transaction.isApprovalTx)
        currentStep.starknetApprovalTransaction = transaction;
      else currentStep.starknetTransaction = transaction;
      break;
    case TransactionType.COSMOS:
      currentStep.cosmosTransaction = transaction;
      break;
    case TransactionType.SOLANA:
      currentStep.solanaTransaction = transaction;
      break;
    case TransactionType.TRANSFER:
      currentStep.transferTransaction = transaction;
      break;
    case TransactionType.TON:
      currentStep.tonTransaction = transaction;
      break;
    default:
      ((x: never) => {
        throw new Error(`${x} was unhandled!`);
      })(txType);
  }
  return currentStep;
};

/**
 *
 * Returns current step transaction type
 *
 */
export const getCurrentStepTxType = (
  currentStep: PendingSwapStep
): TransactionType | undefined => {
  return getCurrentStepTx(currentStep)?.type;
};

/**
 *
 * Returns a boolean indicating that current step is an approval tx or not.
 *
 */
export const isApprovalCurrentStepTx = (
  currentStep: PendingSwapStep
): boolean => {
  const {
    evmApprovalTransaction,
    starknetApprovalTransaction,
    tronApprovalTransaction,
  } = currentStep;
  return !!(
    evmApprovalTransaction ||
    starknetApprovalTransaction ||
    tronApprovalTransaction
  );
};

/**
 * When we are doing a swap, there are some common fields that will be updated together.
 * This function helps us to update a swap status and also it will update some more fields like `extraMessageSeverity` based on the input.
 */
export function updateSwapStatus({
  getStorage,
  setStorage,
  nextStatus,
  nextStepStatus,
  message,
  details,
  errorCode = null,
  hasAlreadyProceededToSign,
}: {
  getStorage: ExecuterActions<
    SwapStorage,
    SwapActionTypes,
    SwapQueueContext
  >['getStorage'];
  setStorage: ExecuterActions<
    SwapStorage,
    SwapActionTypes,
    SwapQueueContext
  >['setStorage'];
  nextStatus?: SwapStatus;
  nextStepStatus?: StepStatus;
  message?: string;
  details?: string | null | undefined;
  errorCode?: APIErrorCode | SignerErrorCode | null;
  hasAlreadyProceededToSign?: boolean;
}): {
  swap: PendingSwap;
  step: PendingSwapStep | null;
  failureType?: APIErrorCode;
} {
  const swap = getStorage().swapDetails;
  const currentStep = getCurrentStep(swap);
  const updatedResult: {
    swap: PendingSwap;
    step: PendingSwapStep | null;
    failureType?: APIErrorCode;
  } = {
    swap,
    step: currentStep,
  };
  if (!!nextStepStatus && !!currentStep) currentStep.status = nextStepStatus;

  if (nextStatus) swap.status = nextStatus;
  swap.hasAlreadyProceededToSign = hasAlreadyProceededToSign;
  if (!!nextStatus && ['failed', 'success'].includes(nextStatus))
    swap.finishTime = new Date().getTime().toString();

  if (!!message || !!details) {
    swap.extraMessage = message || '';
    swap.extraMessageDetail = details || '';
  }

  if (!!nextStepStatus && ['failed'].includes(nextStepStatus)) {
    //if user cancel the swap, we should pass relevant reason to the server.
    const errorReason =
      details && details.includes('Warning')
        ? 'Swap canceled by user.'
        : details;
    const walletType = getRelatedWalletOrNull(swap, currentStep!)?.walletType;
    swap.extraMessageSeverity = MessageSeverity.error;

    const failureType = mapAppErrorCodesToAPIErrorCode(errorCode);
    updatedResult.failureType = failureType;

    httpService()
      .reportFailure({
        requestId: swap.requestId,
        step: currentStep?.id || 1,
        eventType: failureType,
        reason: errorReason || '',
        tags: walletType
          ? {
              wallet: walletType,
            }
          : undefined,
      })
      .then()
      .catch();
  } else if (!!nextStepStatus && ['running'].includes(nextStepStatus))
    swap.extraMessageSeverity = MessageSeverity.info;
  else if (!!nextStepStatus && ['success', 'approved'].includes(nextStepStatus))
    swap.extraMessageSeverity = MessageSeverity.success;
  else if (nextStepStatus && ['waitingForApproval'].includes(nextStepStatus))
    swap.extraMessageSeverity = MessageSeverity.warning;

  if (nextStepStatus === 'running' && currentStep)
    currentStep.startTransactionTime = new Date().getTime();

  setStorage({
    ...getStorage(),
    swapDetails: swap,
  });

  return updatedResult;
}

/**
 *
 * Set current step transaction hash, update pending swap status, and notify user if needed
 *
 */
export function setStepTransactionIds(
  { getStorage, setStorage }: ExecuterActions<SwapStorage, SwapActionTypes>,
  txId: string | null,
  explorerUrl?: { url?: string; description?: string }
): void {
  const swap = getStorage().swapDetails;
  swap.hasAlreadyProceededToSign = null;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentStep = getCurrentStep(swap)!;
  currentStep.executedTransactionId = txId;
  currentStep.executedTransactionTime = new Date().getTime().toString();
  if (explorerUrl?.url)
    currentStep.explorerUrl = [
      ...(currentStep.explorerUrl || []),
      {
        url: explorerUrl.url,
        description: explorerUrl.description || null,
      },
    ];

  const isApproval = isApprovalCurrentStepTx(currentStep);

  if (isApproval) swap.extraMessage = 'Checking approve transaction status ...';
  else swap.extraMessage = 'Checking transaction status ...';

  swap.extraMessageDetail = '';
  swap.extraMessageSeverity = MessageSeverity.info;

  setStorage({
    ...getStorage(),
    swapDetails: swap,
  });

  notifier({
    event: {
      type: StepEventType.TX_EXECUTION,
      status: StepExecutionEventStatus.TX_SENT,
    },
    swap: swap,
    step: currentStep,
  });

  notifier({
    event: { type: StepEventType.CHECK_STATUS },
    swap: swap,
    step: currentStep,
  });
}

/**
 * If a swap needs a wallet to be connected,
 * By calling this function some related fields will be updated to show a correct message and state for notfiying the user.
 */
export function markRunningSwapAsWaitingForConnectingWallet(
  {
    getStorage,
    setStorage,
  }: Pick<ExecuterActions, 'getStorage' | 'setStorage'>,
  reason: string,
  reasonDetail: string
): void {
  const swap = getStorage().swapDetails as SwapStorage['swapDetails'];
  const currentStep = getCurrentStep(swap);
  if (!currentStep) return;
  const currentTime = new Date();
  swap.lastNotificationTime = currentTime.getTime().toString();

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

/**
 * If a swap needs a certain network to proceed,
 * By calling this function some related fields will be updated to show a correct message and state for notfiying the user.
 */
export function markRunningSwapAsSwitchingNetwork({
  getStorage,
  setStorage,
}: Pick<ExecuterActions, 'getStorage' | 'setStorage'>):
  | {
      swap: PendingSwap;
      step: PendingSwapStep;
    }
  | undefined {
  const swap = getStorage().swapDetails as SwapStorage['swapDetails'];

  const currentStep = getCurrentStep(swap);
  if (!currentStep) return;

  // Generate message
  const { type } = getRequiredWallet(swap);
  const fromBlockchain = getCurrentBlockchainOf(swap, currentStep);
  const reason = `Change ${type} wallet network to ${fromBlockchain}`;
  const reasonDetail = `Please change your ${type} wallet network to ${fromBlockchain}.`;

  const currentTime = new Date();
  swap.lastNotificationTime = currentTime.getTime().toString();

  currentStep.networkStatus = PendingSwapNetworkStatus.WaitingForNetworkChange;
  swap.networkStatusExtraMessage = reason;
  swap.networkStatusExtraMessageDetail = reasonDetail;

  setStorage({
    ...getStorage(),
    swapDetails: swap,
  });

  return {
    swap,
    step: currentStep,
  };
}

/**
 * We are marking the queue as it depends on other queues to be run (on Parallel mode)
 * By calling this function some related fields will be updated to show a correct message and state for notfiying the user.
 */
export function markRunningSwapAsDependsOnOtherQueues({
  getStorage,
  setStorage,
}: Pick<ExecuterActions, 'getStorage' | 'setStorage'>):
  | {
      swap: PendingSwap;
      step: PendingSwapStep;
    }
  | undefined {
  const swap = getStorage().swapDetails as SwapStorage['swapDetails'];
  const currentStep = getCurrentStep(swap);
  if (!currentStep) return;

  swap.networkStatusExtraMessage = '';
  swap.networkStatusExtraMessageDetail = '';
  currentStep.networkStatus = PendingSwapNetworkStatus.WaitingForQueue;

  notifier({
    event: {
      type: StepEventType.TX_EXECUTION_BLOCKED,
      status: StepExecutionBlockedEventStatus.WAITING_FOR_QUEUE,
    },
    swap,
    step: currentStep,
  });

  setStorage({
    ...getStorage(),
    swapDetails: swap,
  });

  return {
    swap,
    step: currentStep,
  };
}

export function delay(ms: number): Promise<unknown> {
  return new Promise((res) => setTimeout(res, ms));
}

/**
 *
 * To execute a swap, we are keeping the user prefrences on what wallet they are going to use for a sepecific blockchain
 * By passing the swap and the network we are looking for, it returns the wallet name that user selected.
 *
 */
export const getSwapWalletType = (
  swap: PendingSwap,
  network: Network
): WalletType => {
  return swap.wallets[network]?.walletType;
};

/**
 *
 * We are keeping the connected wallet in a specific structure (`Wallet`),
 * By using this function we normally want to check a specific wallet is connected and exists or not.
 *
 */
export function isWalletNull(wallet: Wallet | null): boolean {
  return (
    wallet === null ||
    wallet?.blockchains === null ||
    wallet?.blockchains.length === 0
  );
}

/**
 * On our implementation for `wallets` package, We keep the instance in 2 ways
 * If it's a single chain wallet, it returns the instance directly,
 * If it's a multichain wallet, it returns a `Map` of instances.
 * This function will get the `ETHEREUM` instance in both types.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getEvmProvider(providers: Providers, type: WalletType): any {
  if (type && providers[type]) {
    // we need this because provider can return an instance or a map of instances, so what you are doing here is try to detect that.
    if (providers[type].size) return providers[type].get(Networks.ETHEREUM);

    return providers[type];
  }
  return null;
}

/**
 * In a `PendingSwap`, each step needs a wallet to proceed,
 * By using this function we can access what wallet exactly we need to run current step.
 */
export function getRequiredWallet(swap: PendingSwap): {
  type: WalletType | null;
  network: Network | null;
  address: string | null;
} {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

/**
 * On EVM compatible wallets, There is one instance with different chains (like Polygon)
 * To get the chain from instance we will use this function.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getChainId(provider: any): Promise<string | number | null> {
  try {
    const chainId: number | string | null =
      (await provider.request({ method: 'eth_chainId' })) || provider?.chainId;
    return chainId;
  } catch {
    return provider?.chainId;
  }
}

/**
 * For running a swap safely, we need to make sure about the state of wallet
 * which means the netowrk/chain of wallet should be exactly on what a transaction needs.
 */
export async function isNetworkMatchedForTransaction(
  swap: PendingSwap,
  step: PendingSwapStep,
  wallet: Wallet | null,
  meta: Meta,
  providers: Providers
): Promise<boolean> {
  if (isWalletNull(wallet)) {
    return false;
  }
  const fromBlockChain = getCurrentBlockchainOfOrNull(swap, step);
  if (!fromBlockChain) return false;

  if (
    meta.evmBasedChains.find(
      (evmBlochain) => evmBlochain.name === fromBlockChain
    )
  ) {
    try {
      const sourceWallet = swap.wallets[fromBlockChain];
      if (sourceWallet) {
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
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  }
  return true;
}

export const isTxAlreadyCreated = (
  swap: PendingSwap,
  step: PendingSwapStep
): boolean => {
  const result =
    swap.wallets[step.evmTransaction?.blockChain || ''] ||
    swap.wallets[step.evmApprovalTransaction?.blockChain || ''] ||
    swap.wallets[step.tronTransaction?.blockChain || ''] ||
    swap.wallets[step.tronApprovalTransaction?.blockChain || ''] ||
    swap.wallets[step.starknetTransaction?.blockChain || ''] ||
    swap.wallets[step.starknetApprovalTransaction?.blockChain || ''] ||
    swap.wallets[step.cosmosTransaction?.blockChain || ''] ||
    swap.wallets[step.solanaTransaction?.blockChain || ''] ||
    swap.wallets[step.tonTransaction?.blockChain || ''] ||
    step.transferTransaction?.fromWalletAddress ||
    null;

  return result !== null;
};

export function resetNetworkStatus(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
): void {
  const { getStorage, setStorage } = actions;
  const swap = getStorage().swapDetails;
  const currentStep = getCurrentStep(swap);

  if (currentStep?.networkStatus) {
    currentStep.networkStatus = null;
    setStorage({ ...getStorage(), swapDetails: swap });
  }
}

export function updateNetworkStatus(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>,
  data: {
    message: string;
    details: string;
    status: PendingSwapNetworkStatus | null;
  } = {
    message: '',
    details: '',
    status: null,
  }
): void {
  const { message, details, status } = data;
  const { getStorage, setStorage } = actions;
  const swap = getStorage().swapDetails;
  const currentStep = getCurrentStep(swap);

  if (currentStep?.networkStatus) {
    swap.networkStatusExtraMessage = message;
    swap.networkStatusExtraMessageDetail = details;
    currentStep.networkStatus = status;
    setStorage({ ...getStorage(), swapDetails: swap });
  }
}

/**
 * Event handler for blocked tasks.
 * If a transcation execution is manually blocked (like for parallel or waiting for wallet),
 * This function will be called by queue manager using `queue definition`.
 *
 * It checks if the required wallet is connected, unblock the queue to be run.
 */
export function onBlockForConnectWallet(
  event: WhenTaskBlockedEvent,
  meta: WhenTaskBlockedMeta
): void {
  const { context, queue } = meta;
  const swap = queue.getStorage().swapDetails as SwapStorage['swapDetails'];

  const { ok, reason } = isRequiredWalletConnected(swap, context.state);

  if (!ok) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentStep = getCurrentStep(swap)!;
    const { type: walletType, address } = getRequiredWallet(swap);
    notifier({
      event: {
        type: StepEventType.TX_EXECUTION_BLOCKED,
        ...(reason === 'account_miss_match'
          ? {
              status:
                StepExecutionBlockedEventStatus.WAITING_FOR_CHANGE_WALLET_ACCOUNT,
              requiredAccount: address ?? undefined,
            }
          : {
              status:
                StepExecutionBlockedEventStatus.WAITING_FOR_WALLET_CONNECT,
              requiredWallet: walletType ?? undefined,
              requiredAccount: address ?? undefined,
            }),
      },
      swap: swap,
      step: currentStep,
    });

    markRunningSwapAsWaitingForConnectingWallet(
      {
        getStorage: queue.getStorage.bind(queue),
        setStorage: queue.setStorage.bind(queue),
      },
      ERROR_MESSAGE_WAIT_FOR_WALLET,
      event.reason.description
    );

    return;
  }

  queue.unblock();
}

/**
 * Event handler for blocked tasks.
 * If a transcation execution is manually blocked (like for parallel or waiting for walle),
 * This function will be called by queue manager using `queue definition`.
 *
 * It checks if the required network is connected, unblock the queue to be run.
 * Note: it automatically try to switch the network if its `provider` supports.
 */
export function onBlockForChangeNetwork(
  _event: WhenTaskBlockedEvent,
  meta: WhenTaskBlockedMeta
): void {
  const { context, queue } = meta;
  const swap = queue.getStorage().swapDetails as SwapStorage['swapDetails'];
  const currentStep = getCurrentStep(swap);

  if (!currentStep || swap.status !== 'running') return;

  const result = markRunningSwapAsSwitchingNetwork({
    getStorage: queue.getStorage.bind(queue),
    setStorage: queue.setStorage.bind(queue),
  });

  const requiredNetwork = getCurrentBlockchainOfOrNull(swap, currentStep);

  const requiredWallet = getRequiredWallet(swap).type;

  const currentNetwork = requiredWallet
    ? context.state(requiredWallet).network
    : undefined;

  if (result) {
    notifier({
      event: {
        type: StepEventType.TX_EXECUTION_BLOCKED,
        status: StepExecutionBlockedEventStatus.WAITING_FOR_NETWORK_CHANGE,
        requiredNetwork: requiredNetwork ?? undefined,
        currentNetwork: currentNetwork ?? undefined,
      },
      swap: result.swap,
      step: result.step,
    });
  }

  // Try to auto switch
  const { type, network } = getRequiredWallet(swap);
  if (!!type && !!network) {
    if (context.canSwitchNetworkTo(type, network)) {
      const result = context.switchNetwork(type, network);
      if (result) {
        result
          .then(() => {
            queue.unblock();
          })
          .catch((error) => {
            // ignore switch network errors
            console.log({ error });
          });
      }
    }
  }
}

/**
 * Event handler for blocked tasks. (Parallel mode)
 * If a transcation execution flow is manually blocked (like for parallel or waiting for walle),
 * This function will be called by queue manager using `queue definition`.
 *
 * It checks the blocked tasks, if there is no active `claimed` queue, try to give it to the best candidate.
 */
export function onDependsOnOtherQueues(
  _event: WhenTaskBlockedEvent,
  meta: WhenTaskBlockedMeta
): void {
  const { getBlockedTasks, forceExecute, queue, manager, context } = meta;
  const { setClaimer, claimedBy, reset } = claimQueue();

  // We only needs those blocked tasks that have DEPENDS_ON_OTHER_QUEUES reason.
  const blockedTasks = getBlockedTasks().filter(
    (task) => task.reason.reason === BlockReason.DEPENDS_ON_OTHER_QUEUES
  );

  if (blockedTasks.length === 0) {
    return;
  }

  const claimerId = claimedBy();
  const isClaimedByAnyQueue = !!claimerId;

  if (claimerId === queue.id) return;

  // Check if any queue `claimed` before, if yes, we don't should do anything.
  if (isClaimedByAnyQueue) {
    // We need to keep the latest swap messages
    markRunningSwapAsDependsOnOtherQueues({
      getStorage: queue.getStorage.bind(queue),
      setStorage: queue.setStorage.bind(queue),
    });
    return;
  }

  // Prioritize current queue to be run first.

  let task = blockedTasks.find((task) => {
    return task.queue_id === meta.queue_id;
  });

  // If current task isn't available anymore, fallback to first blocked task.
  if (!task) {
    const firstBlockedTask = blockedTasks[0];
    task = firstBlockedTask;
  }

  setClaimer(task.queue_id);
  const claimedStorage = task.storage.get() as SwapStorage;
  const { type, network, address } = getRequiredWallet(
    claimedStorage.swapDetails
  );

  // Run
  forceExecute(task.queue_id, {
    claimedBy: claimedBy(),
    resetClaimedBy: () => {
      reset();
      // TODO: Use key generator
      retryOn(
        `${type}-${network}:${address}`,
        manager,
        context.canSwitchNetworkTo
      );
    },
  });
}

export function isRequiredWalletConnected(
  swap: PendingSwap,
  getState: (type: WalletType) => WalletState
): { ok: boolean; reason: 'not_connected' | 'account_miss_match' } {
  const { type, address } = getRequiredWallet(swap);
  if (!type || !address) {
    return { ok: false, reason: 'not_connected' };
  }
  const walletState = getState(type);
  const { accounts, connected } = walletState;
  const connectedAccounts = accounts || [];
  if (!connected) return { ok: false, reason: 'not_connected' };

  const matched = connectedAccounts.some((account) => {
    const { address: accountAddress } = readAccountAddress(account);
    return address.toLocaleLowerCase() === accountAddress.toLocaleLowerCase();
  });
  return { ok: matched, reason: 'account_miss_match' };
}

export function singTransaction(
  actions: ExecuterActions<SwapStorage, SwapActionTypes, SwapQueueContext>
): void {
  const { setTransactionDataByHash } = inMemoryTransactionsData();
  const { getStorage, setStorage, failed, next, schedule, context } = actions;
  const { meta, getSigners, isMobileWallet } = context;
  const swap = getStorage().swapDetails;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentStep = getCurrentStep(swap)!;

  const sourceWallet = getRelatedWallet(swap, currentStep);
  const mobileWallet = isMobileWallet(sourceWallet?.walletType);
  const walletAddress = getCurrentAddressOf(swap, currentStep);
  const walletSigners = getSigners(sourceWallet.walletType);
  const currentStepBlockchain = getCurrentBlockchainOf(swap, currentStep);

  const onFinish = () => {
    // TODO resetClaimedBy is undefined here
    if (actions.context.resetClaimedBy) {
      actions.context.resetClaimedBy();
    }
  };

  const tx = getCurrentStepTx(currentStep);
  const txType = tx?.type;
  const isApproval = isApprovalCurrentStepTx(currentStep);

  if (!tx || !txType) {
    const extraMessage = 'Unexpected Error: tx is null!';
    const updateResult = updateSwapStatus({
      getStorage,
      setStorage,
      nextStatus: 'failed',
      nextStepStatus: 'failed',
      message: extraMessage,
      details: undefined,
      errorCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
    });
    notifier({
      event: {
        type: StepEventType.FAILED,
        reason: extraMessage,
        reasonCode: 'CLIENT_UNEXPECTED_BEHAVIOUR',
      },
      ...updateResult,
    });
    failed();
    return onFinish();
  }

  const chainId = meta.blockchains?.[tx.blockChain]?.chainId;

  const hasAlreadyProceededToSign =
    typeof swap.hasAlreadyProceededToSign === 'boolean';

  let nextStatus: SwapStatus | undefined,
    nextStepStatus: StepStatus,
    message: string,
    details: string,
    eventType: StepEventType;

  if (isApproval) {
    message = `Waiting for approval of ${currentStep?.fromSymbol} coin ${
      mobileWallet ? 'on your mobile phone!' : ''
    }`;
    details =
      'Waiting for approve transaction to be mined and confirmed successfully';
    nextStepStatus = 'waitingForApproval';
    nextStatus = undefined;
    eventType = StepEventType.TX_EXECUTION;
  } else if (hasAlreadyProceededToSign) {
    message = 'Transaction is expired. Please try again.';
    nextStepStatus = 'failed';
    nextStatus = 'failed';
    details = '';
    eventType = StepEventType.FAILED;
  } else {
    message = 'Executing transaction ...';
    nextStepStatus = 'running';
    nextStatus = 'running';
    details = `${mobileWallet ? 'Check your mobile phone!' : ''}`;
    eventType = StepEventType.TX_EXECUTION;
  }

  const updateResult = updateSwapStatus({
    getStorage,
    setStorage,
    nextStepStatus,
    nextStatus,
    message: message,
    details: details,
    hasAlreadyProceededToSign: isApproval
      ? undefined
      : hasAlreadyProceededToSign,
    errorCode: hasAlreadyProceededToSign ? 'TX_EXPIRED' : undefined,
  });

  if (eventType === StepEventType.FAILED) {
    notifier({
      event: {
        type: eventType,
        reason: message,
        reasonCode: updateResult.failureType ?? DEFAULT_ERROR_CODE,
      },
      ...updateResult,
    });
  } else
    notifier({
      event: { type: eventType, status: StepExecutionEventStatus.SEND_TX },
      ...updateResult,
    });

  if (hasAlreadyProceededToSign) {
    failed();
    onFinish();
    return;
  }
  const signer = walletSigners.getSigner(txType);
  signer.signAndSendTx(tx, walletAddress, chainId).then(
    ({ hash, response }) => {
      const explorerUrl = getScannerUrl(
        hash,
        currentStepBlockchain,
        meta.blockchains
      );
      setStepTransactionIds(
        actions,
        hash,
        explorerUrl &&
          (!response || (response && !response.hashRequiringUpdate))
          ? { url: explorerUrl, description: isApproval ? 'Approve' : 'Swap' }
          : undefined
      );
      // response used for evm transactions to get receipt and track replaced
      response && setTransactionDataByHash(hash, { response });
      schedule(SwapActionTypes.CHECK_TRANSACTION_STATUS);
      next();
      onFinish();
    },
    (error) => {
      if (swap.status === 'failed') return;

      const { extraMessage, extraMessageDetail, extraMessageErrorCode } =
        prettifyErrorMessage(error);

      logRPCError(
        error?.trace?.stack || error?.trace || error?.root || error,
        swap,
        currentStep,
        sourceWallet?.walletType
      );

      const updateResult = updateSwapStatus({
        getStorage,
        setStorage,
        nextStatus: 'failed',
        nextStepStatus: 'failed',
        message: extraMessage,
        details: extraMessageDetail,
        errorCode: extraMessageErrorCode,
      });

      notifier({
        event: {
          type: StepEventType.FAILED,
          reason: extraMessage,
          reasonCode: updateResult.failureType ?? DEFAULT_ERROR_CODE,
        },
        ...updateResult,
      });
      failed();
      onFinish();
    }
  );
}

export function checkWaitingForConnectWalletChange(params: {
  wallet_network: string;
  manager?: Manager;
  evmChains: EvmBlockchainMeta[];
}): void {
  const { wallet_network, evmChains, manager } = params;
  const [wallet, network] = splitWalletNetwork(wallet_network);
  // We only need change network for EVM chains.
  if (!evmChains.some((chain) => chain.name == network)) return;

  manager?.getAll().forEach((q) => {
    const queueStorage = q.list.getStorage() as SwapStorage | undefined;
    const swap = queueStorage?.swapDetails;
    if (swap && swap.status === 'running') {
      const currentStep = getCurrentStep(swap);
      if (currentStep) {
        const currentStepRequiredWallet =
          queueStorage?.swapDetails.wallets[currentStep.fromBlockchain]
            ?.walletType;
        const hasWaitingForConnect = Object.keys(q.list.state.tasks).some(
          (taskId) => {
            const task = q.list.state.tasks[taskId];
            return (
              task.status === Status.BLOCKED &&
              // TODO double check later
              [BlockReason.WAIT_FOR_CONNECT_WALLET].includes(
                task.blockedFor?.reason
              )
            );
          }
        );

        const requiredNetwork = getCurrentBlockchainOfOrNull(swap, currentStep);

        if (
          currentStepRequiredWallet === wallet &&
          hasWaitingForConnect &&
          requiredNetwork != network
        ) {
          const queueInstance = q.list;
          const { type } = getRequiredWallet(swap);
          const description = ERROR_MESSAGE_WAIT_FOR_CHANGE_NETWORK(type);

          q.list.block({
            reason: {
              reason: BlockReason.WAIT_FOR_NETWORK_CHANGE,
              description,
            },
            silent: true,
          });

          const result = markRunningSwapAsSwitchingNetwork({
            getStorage: queueInstance.getStorage.bind(queueInstance),
            setStorage: queueInstance.setStorage.bind(queueInstance),
          });

          if (result) {
            notifier({
              event: {
                type: StepEventType.TX_EXECUTION_BLOCKED,
                status:
                  StepExecutionBlockedEventStatus.WAITING_FOR_NETWORK_CHANGE,
                currentNetwork: network,
                requiredNetwork: requiredNetwork ?? undefined,
              },
              swap: result.swap,
              step: result.step,
            });
          }
        }
      }
    }
  });
}

export function checkWaitingForNetworkChange(manager?: Manager): void {
  manager?.getAll().forEach((q) => {
    const hasWaitingForNetwork = Object.keys(q.list.state.tasks).some(
      (taskId) => {
        const task = q.list.state.tasks[taskId];
        return (
          task.status === Status.BLOCKED &&
          [
            BlockReason.WAIT_FOR_NETWORK_CHANGE,
            BlockReason.DEPENDS_ON_OTHER_QUEUES,
          ].includes(task.blockedFor?.reason)
        );
      }
    );

    if (hasWaitingForNetwork) {
      const swap = q.list.getStorage()
        ?.swapDetails as SwapStorage['swapDetails'];
      if (swap.status === 'running') {
        const { type } = getRequiredWallet(swap);
        const description = ERROR_MESSAGE_WAIT_FOR_WALLET_DESCRIPTION(type);

        // Change the block reason to waiting for connecting wallet
        q.list.block({
          reason: {
            reason: BlockReason.WAIT_FOR_CONNECT_WALLET,
            description,
          },
        });
      }
    }
  });
}

/**
 * Get list of all running swaps
 *
 * @param manager
 * @returns list of pending swaps
 */
export function getRunningSwaps(manager: Manager): PendingSwap[] {
  const queues = manager?.getAll() || new Map<QueueName, QueueInfo>();
  const result: PendingSwap[] = [];
  queues.forEach((q) => {
    // retry only on affected queues
    const queueStorage = q.list.getStorage() as SwapStorage | undefined;
    const swap = queueStorage?.swapDetails;
    if (!swap || swap.status !== 'running') return;
    result.push(swap);
  });
  return result;
}

/**
 *
 * Trying to reset notifications for pending swaps to correct message on page load.
 * We could remove this after supporting auto connect for wallets.
 *
 * @param swaps
 * @param notifier
 * @returns
 */
export function resetRunningSwapNotifsOnPageLoad(runningSwaps: PendingSwap[]) {
  runningSwaps.forEach((swap) => {
    const currentStep = getCurrentStep(swap);
    const eventType = StepEventType.TX_EXECUTION_BLOCKED;
    let eventSubtype:
      | StepExecutionBlockedEventStatus.WAITING_FOR_QUEUE
      | StepExecutionBlockedEventStatus.WAITING_FOR_WALLET_CONNECT
      | undefined;
    if (currentStep?.networkStatus === PendingSwapNetworkStatus.WaitingForQueue)
      eventSubtype = StepExecutionBlockedEventStatus.WAITING_FOR_QUEUE;
    else if (swap?.status === 'running') {
      eventSubtype = StepExecutionBlockedEventStatus.WAITING_FOR_WALLET_CONNECT;
    }
    if (!!eventType && !!notifier) {
      notifier({
        event: {
          type: eventType,
          status:
            eventSubtype ?? StepExecutionBlockedEventStatus.WAITING_FOR_QUEUE,
        },
        swap: swap,
        step: currentStep,
      });
    }
  });
}

/**
 *
 * Try to run blocked tasks by wallet and network name.
 * Goes through queues and extract blocked queues with matched wallet.
 * If found any blocked tasks with same wallet and network, runs them.
 * If not, runs only blocked tasks with matched wallet.
 *
 * @param wallet_network a string includes `wallet` type and `network` type.
 * @param manager
 * @returns
 */
export function retryOn(
  wallet_network: string,
  manager?: Manager,
  canSwitchNetworkTo?: (type: WalletType, network: Network) => boolean,
  options = { fallbackToOnlyWallet: true }
): void {
  const [wallet, network] = splitWalletNetwork(wallet_network);
  if (!wallet || !network) {
    return;
  }

  const walletAndNetworkMatched: QueueType[] = [];
  const onlyWalletMatched: QueueType[] = [];

  manager?.getAll().forEach((q) => {
    // retry only on affected queues
    if (q.status === Status.BLOCKED) {
      const queueStorage = q.list.getStorage() as SwapStorage | undefined;
      const swap = queueStorage?.swapDetails;

      if (swap && swap.status === 'running') {
        const currentStep = getCurrentStep(swap);
        if (currentStep) {
          if (
            getCurrentBlockchainOfOrNull(swap, currentStep) == network &&
            queueStorage?.swapDetails.wallets[network]?.walletType === wallet
          ) {
            walletAndNetworkMatched.push(q.list);
          } else if (
            queueStorage?.swapDetails.wallets[currentStep.fromBlockchain]
              ?.walletType === wallet
          ) {
            onlyWalletMatched.push(q.list);
          }
        }
      }
    }
  });

  let finalQueueToBeRun: QueueType | undefined = undefined;
  if (walletAndNetworkMatched.length > 0) {
    finalQueueToBeRun = walletAndNetworkMatched[0];

    if (walletAndNetworkMatched.length > 1) {
      for (let i = 1; i < walletAndNetworkMatched.length; i++) {
        const currentQueue = walletAndNetworkMatched[i];

        markRunningSwapAsDependsOnOtherQueues({
          getStorage: currentQueue.getStorage.bind(currentQueue),
          setStorage: currentQueue.setStorage.bind(currentQueue),
        });
      }
    }
  } else if (onlyWalletMatched.length > 0 && options.fallbackToOnlyWallet) {
    finalQueueToBeRun = onlyWalletMatched[0];
  }

  if (!canSwitchNetworkTo?.(wallet, network)) finalQueueToBeRun?.unblock();
  else finalQueueToBeRun?.checkBlock();
}

/* 
  For avoiding conflict by making too many requests to wallet, we need to make sure
  We only run one request at a time (In parallel mode).
  */
export function isNeedBlockQueueForParallel(step: PendingSwapStep): boolean {
  return !!step.evmTransaction || !!step.evmApprovalTransaction;
}

/*
Create transaction endpoint doesn't return error code on http status code,
For backward compatibilty with server and sdk, we use this wrapper to reject the promise.
*/
export async function throwOnOK(
  rawResponse: Promise<CreateTransactionResponse>
): Promise<CreateTransactionResponse> {
  const responseBody = await rawResponse;
  if (!responseBody.ok || !responseBody.transaction) {
    throw PrettyError.CreateTransaction(
      responseBody.error || 'bad response from create tx endpoint'
    );
  }
  return responseBody;
}

export function cancelSwap(
  swap: QueueInfo,
  manager?: Manager
): {
  swap: PendingSwap;
  step: PendingSwapStep | null;
} {
  const { reset } = claimQueue();
  swap.actions.cancel();

  const updateResult = updateSwapStatus({
    getStorage: swap.actions.getStorage,
    setStorage: swap.actions.setStorage,
    message: 'Swap canceled by user.',
    details:
      "Warning: If you've already signed and sent a transaction, it won't be affected, but next swap steps will not be executed.",
    nextStatus: 'failed',
    nextStepStatus: 'failed',
    errorCode: 'USER_CANCEL',
  });

  notifier({
    event: {
      type: StepEventType.FAILED,
      reasonCode: 'USER_CANCEL',
      reason: updateResult.swap.extraMessage ?? undefined,
    },

    swap: updateResult.swap,
    step: updateResult.step,
  });

  reset();
  if (manager) manager?.retry();

  return updateResult;
}

export function getLastSuccessfulStep<T extends { status: StepStatus }[]>(
  steps: T
): ArrayElement<T> | undefined {
  return steps
    .slice()
    .reverse()
    .find((step) => step.status === 'success') as ArrayElement<T> | undefined;
}

export function getFailedStep<T extends { status: StepStatus }[]>(
  steps: T
): ArrayElement<T> | undefined {
  return steps
    .slice()
    .reverse()
    .find((step) => step.status === 'failed') as ArrayElement<T> | undefined;
}

export function isApprovalTX(step: Step): boolean {
  const { transaction } = step;
  const approvalTx =
    (transaction?.type === TransactionType.EVM && transaction.isApprovalTx) ||
    (transaction?.type === TransactionType.STARKNET &&
      transaction.isApprovalTx) ||
    (transaction?.type === TransactionType.TRON && transaction.isApprovalTx);

  return approvalTx;
}
