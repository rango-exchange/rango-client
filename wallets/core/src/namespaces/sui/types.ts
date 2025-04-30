import type { Accounts } from '../../types/accounts.js';
import type {
  AutoImplementedActionsByRecommended,
  CommonActions,
} from '../common/types.js';

export interface SuiActions
  extends AutoImplementedActionsByRecommended,
    CommonActions {
  connect: () => Promise<Accounts>;
  canEagerConnect: () => Promise<boolean>;
}

// eslint-disable-next-line
export type ProviderAPI = Record<string, any>;
