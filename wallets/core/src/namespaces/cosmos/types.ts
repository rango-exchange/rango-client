import type {
  AutoImplementedActionsByRecommended,
  CommonActions,
} from '../common/types.js';

export interface CosmosActions
  extends AutoImplementedActionsByRecommended,
    CommonActions {
  // TODO
  connect: () => Promise<string>;
}
