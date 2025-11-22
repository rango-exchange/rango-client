import type { Accounts } from '../../types/accounts.js';
import type {
  AutoImplementedActionsByRecommended,
  CommonActions,
} from '../common/types.js';

export interface StarknetActions
  extends AutoImplementedActionsByRecommended,
    CommonActions {
  connect: (options?: ConnectOptions) => Promise<Accounts>;
  canEagerConnect: () => Promise<boolean>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ProviderAPI = Record<string, any>;

export type ConnectOptions = {
  derivationPath?: string;
};
