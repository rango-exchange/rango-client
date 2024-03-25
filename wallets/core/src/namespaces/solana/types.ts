import type {
  Accounts,
  AutoImplementedActionsByRecommended,
  CommonActions,
} from '../common/types';

export interface SolanaActions
  extends AutoImplementedActionsByRecommended,
    CommonActions {
  connect: () => Promise<Accounts>;
}
