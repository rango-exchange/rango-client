import type { Accounts } from '../../types/accounts.js';
import type {
  AutoImplementedActionsByRecommended,
  CommonActions,
} from '../common/types.js';

export interface SolanaActions
  extends AutoImplementedActionsByRecommended,
    CommonActions {
  connect: (network?: unknown, derivationPath?: string) => Promise<Accounts>;
  canEagerConnect: () => Promise<boolean>;
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
