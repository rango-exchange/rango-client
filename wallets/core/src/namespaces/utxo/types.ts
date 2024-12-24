import type { Accounts } from '../../types/accounts.js';
import type {
  AutoImplementedActionsByRecommended,
  CommonActions,
} from '../common/types.js';

export interface UtxoActions
  extends AutoImplementedActionsByRecommended,
    CommonActions {
  connect: () => Promise<Accounts>;
}

export type ProviderAPI = Record<string, any>;
