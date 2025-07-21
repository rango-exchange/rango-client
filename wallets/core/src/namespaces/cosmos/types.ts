import type {
  AutoImplementedActionsByRecommended,
  CommonActions,
} from '../common/types.js';

export interface CosmosActions
  extends AutoImplementedActionsByRecommended,
    CommonActions {
  // TODO
  connect: () => Promise<string>;
  canEagerConnect: () => Promise<boolean>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ProviderAPI = Record<string, any>;
