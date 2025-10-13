import type { Accounts } from '../common/mod.js';
import type {
  AutoImplementedActionsByRecommended,
  CommonActions,
} from '../common/types.js';
import type { AccountLinesTrustline } from 'xrpl';

export interface XRPLActions
  extends AutoImplementedActionsByRecommended,
    CommonActions {
  connect: () => Promise<Accounts>;
  canEagerConnect: () => Promise<boolean>;
  accountLines: (
    account: string,
    options?: { peer?: string }
  ) => Promise<AccountLinesTrustline[]>;
}
