import type { WalletWithFeatures as StandardWalletWithFeatures } from '@wallet-standard/base';

import {
  type SolanaSignMessageFeature,
  type SolanaSignTransactionFeature,
} from '@solana/wallet-standard-features';
import {
  type StandardConnectFeature,
  type StandardEventsFeature,
} from '@wallet-standard/features';

export type WalletStandardSolanaInstance = StandardWalletWithFeatures<
  StandardConnectFeature &
    StandardEventsFeature &
    SolanaSignTransactionFeature &
    SolanaSignMessageFeature
>;
