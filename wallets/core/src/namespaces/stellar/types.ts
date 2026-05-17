import type { Accounts } from '../common/mod.js';
import type {
  AutoImplementedActionsByRecommended,
  CommonActions,
} from '../common/types.js';
import type { Horizon } from '@stellar/stellar-sdk';

type BalanceLines = Horizon.AccountResponse['balances'];
export interface StellarActions
  extends AutoImplementedActionsByRecommended,
    CommonActions {
  connect: () => Promise<Accounts>;
  canEagerConnect: () => Promise<boolean>;
  balanceLines: (account: string) => Promise<BalanceLines>;
}
