import type {
  BlockhashWithExpiryBlockHeight,
  Connection,
  PublicKey,
  SendOptions,
  Transaction,
  TransactionSignature,
  VersionedTransaction,
  VersionedTransactionResponse,
} from '@solana/web3.js';

export type SerializedTransaction = Buffer | Uint8Array | number[];

export type SolanaWeb3Signer = (
  solanaWeb3Transaction: Transaction | VersionedTransaction
) => Promise<SerializedTransaction>;

// https://github.com/solana-labs/wallet-adapter/blob/01c6316ce0725e0a075d6adb237bbcb4128e76ad/packages/wallets/phantom/src/adapter.ts#L30
export interface SolanaExternalProvider {
  isPhantom?: boolean;
  publicKey?: { toBytes(): Uint8Array };
  isConnected: boolean;
  signTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T
  ): Promise<T>;
  signAllTransactions<T extends Transaction | VersionedTransaction>(
    transactions: T[]
  ): Promise<T[]>;
  signAndSendTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T,
    options?: SendOptions
  ): Promise<{ signature: TransactionSignature }>;
  signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }>;
  request(...args: any[]): Promise<any>;
  connect(...args: any[]): Promise<any>;
  disconnect(): Promise<void>;
  accountChanged(newPublicKey: PublicKey): any;
}

export type TransactionSenderAndConfirmationWaiterArgs = {
  connection: Connection;
  serializedTransaction: Buffer;
  blockhashWithExpiryBlockHeight: BlockhashWithExpiryBlockHeight;
};

export type TransactionSenderAndConfirmationWaiterResponse = {
  txId: string | null;
  txResponse: VersionedTransactionResponse | null;
};
