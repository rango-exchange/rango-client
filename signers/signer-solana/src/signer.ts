import type { GenericSigner, SolanaTransaction } from 'rango-types';

import { executeSolanaTransaction } from './helpers';
import {
  PublicKey,
  SendOptions,
  Transaction,
  TransactionSignature,
  VersionedTransaction,
} from '@solana/web3.js';

import { SignerError, SignerErrorCode } from 'rango-types';

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

export class DefaultSolanaSigner implements GenericSigner<SolanaTransaction> {
  private provider: SolanaExternalProvider;

  constructor(provider: SolanaExternalProvider) {
    this.provider = provider;
  }

  async signMessage(msg: string): Promise<string> {
    try {
      const encodedMessage = new TextEncoder().encode(msg);
      const { signature } = await this.provider.request({
        method: 'signMessage',
        params: {
          message: encodedMessage,
        },
      });
      return signature;
    } catch (error) {
      throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, error);
    }
  }

  async signAndSendTx(tx: SolanaTransaction): Promise<{ hash: string }> {
    try {
      const hash = await executeSolanaTransaction(tx, this.provider);
      return { hash };
    } catch (error) {
      throw new SignerError(SignerErrorCode.SEND_TX_ERROR, undefined, error);
    }
  }
}
