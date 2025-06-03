import type { Accounts } from '../../types/accounts.js';
import type {
  AutoImplementedActionsByRecommended,
  CommonActions,
} from '../common/types.js';
import type { Transaction, VersionedTransaction } from '@solana/web3.js';

export interface SolanaActions
  extends AutoImplementedActionsByRecommended,
    CommonActions {
  connect: () => Promise<Accounts>;
  canEagerConnect: () => Promise<boolean>;
  getInstance: () => ProviderAPI | undefined;
  signMessage: (message: string) => Promise<string>;
  signTransaction: (
    transaction: Transaction | VersionedTransaction
  ) => Promise<Transaction | VersionedTransaction>;
}

/*
 *
 * TODO: That would be better to define a type for Solana injected wallets.
 * They have something called [Wallet Standard](https://github.com/wallet-standard/wallet-standard) but not sure all the Solana wallets support that (Phantom do).
 * If Phantom's interface is what Solana wallets are supporting, another option would be define that type here.
 *
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ProviderAPI = Record<string, any>;
