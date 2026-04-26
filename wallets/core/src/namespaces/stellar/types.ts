import type { Accounts } from '../common/mod.js';
import type {
  AutoImplementedActionsByRecommended,
  CommonActions,
} from '../common/types.js';

type TrustLine = {
  code: string;
  issuer: string;
  limit: string;
};

export interface StellarActions
  extends AutoImplementedActionsByRecommended,
    CommonActions {
  connect: () => Promise<Accounts>;
  canEagerConnect: () => Promise<boolean>;
  accountLines: (account: string) => Promise<TrustLine[]>;
}
