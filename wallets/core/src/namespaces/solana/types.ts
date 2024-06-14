import type {
  Accounts,
  AutoImplementedActionsByRecommended,
  CommonActions,
} from '../common/types.js';

export interface SolanaActions
  extends AutoImplementedActionsByRecommended,
    CommonActions {
  connect: () => Promise<Accounts>;
}

/*
 *
 * TODO: That would be better to define a type for Solana injected wallets.
 * They have something called [Wallet Standard](https://github.com/wallet-standard/wallet-standard) but not sure all the Solana wallets support that (Phantom do).
 * If Phantom's interface is what Solana wallets are supporting, another option would be define that type here.
 *
 */
export type ProviderApi = any;
