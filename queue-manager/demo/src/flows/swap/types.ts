import { QueueStorage } from "@rangodev/queue-manager-core";
import { QueueContext } from "@rangodev/queue-manager-core/dist/queue";
import { ConnectResult, Providers } from "@rangodev/wallets-core";
import {
  Meta,
  Network,
  WalletSigners,
  WalletState,
  WalletType,
} from "@rangodev/wallets-shared";
import { PendingSwap, SwapProgressNotification, Wallet } from "../rango/types";

export interface SwapStorage extends QueueStorage {
  swapDetails: PendingSwap;
}

export enum SwapActionTypes {
  START = "START",
  SCHEDULE_NEXT_STEP = "SCHEDULE_NEXT_STEP",
  CREATE_TRANSACTION = "CREATE_TRANSACTION",
  EXECUTE_TRANSACTION = "EXECUTE_TRANSACTION",
  CHECK_TRANSACTION_STATUS = "CHECK_TRANSACTION_STATUS",
}

export type GetCurrentAddress = (
  type: WalletType,
  network: Network
) => string | undefined;

export enum BlockReason {
  WAIT_FOR_CONNECT_WALLET = "waiting_for_connecting_wallet",
  WAIT_FOR_NETWORK_CHANGE = "waiting_for_network_change",
  DEPENDS_ON_OTHER_QUEUES = "depends_on_other_queues",
}

export interface Block<T = any> {
  reason: BlockReason;
  description: string;
  details?: T;
}

export interface SwapQueueContext extends QueueContext {
  meta: Meta;
  wallets: Wallet | null;
  providers: Providers;
  getSigners: (type: WalletType) => WalletSigners;
  switchNetwork: (
    wallet: WalletType,
    network: Network
  ) => Promise<ConnectResult> | undefined;
  connect: (
    wallet: WalletType,
    network: Network
  ) => Promise<ConnectResult> | undefined;
  state: (type: WalletType) => WalletState;
  notifier: (data: SwapProgressNotification) => void;

  // Dynamically will be added to context.
  claimedBy?: string;
  resetClaimedBy?: () => void;
}
