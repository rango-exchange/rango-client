import type {
  Accounts,
  AutoImplementedActionsByRecommended,
  CommonActions,
} from '../common/types';

export interface EvmActions
  extends AutoImplementedActionsByRecommended,
    CommonActions {
  connect: (chain: string) => Accounts;
}
