import type { Accounts } from '../common/mod.js';
import type {
  AutoImplementedActionsByRecommended,
  CommonActions,
} from '../common/types.js';

export interface XRPLActions
  extends AutoImplementedActionsByRecommended,
    CommonActions {
  connect: () => Promise<Accounts>;
  canEagerConnect: () => Promise<boolean>;
}
