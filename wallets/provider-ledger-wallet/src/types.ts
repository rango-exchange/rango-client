import type {
  SolanaSignMessageFeature,
  SolanaSignTransactionFeature,
} from '@solana/wallet-standard-features';
import type { WalletWithFeatures } from '@wallet-standard/base';
import type {
  StandardConnectFeature,
  StandardDisconnectFeature,
  StandardEventsFeature,
} from '@wallet-standard/features';

/*
 * The Wallet Standard wallet registered by
 * `@ledgerhq/ledger-wallet-provider-solana`. The package doesn't export its
 * wallet type, so we describe the features we rely on.
 */
export type LedgerSolanaWallet = WalletWithFeatures<
  StandardConnectFeature &
    StandardDisconnectFeature &
    StandardEventsFeature &
    SolanaSignMessageFeature &
    SolanaSignTransactionFeature
>;

export type Environments = {
  dAppIdentifier: string;
  apiKey: string;
  loggerLevel?: 'fatal' | 'error' | 'warn' | 'info' | 'debug';
  hideButton?: boolean;
};
