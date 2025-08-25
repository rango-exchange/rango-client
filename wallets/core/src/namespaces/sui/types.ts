import type { Accounts } from '../../types/accounts.js';
import type {
  AutoImplementedActionsByRecommended,
  CommonActions,
} from '../common/types.js';
import type {
  StandardConnectFeature,
  StandardEventsFeature,
  SuiFeatures,
  WalletWithFeatures,
} from '@mysten/wallet-standard';

export interface SuiActions
  extends AutoImplementedActionsByRecommended,
    CommonActions {
  connect: () => Promise<Accounts>;
  canEagerConnect: () => Promise<boolean>;
}

export type ProviderAPI = WalletWithFeatures<
  StandardConnectFeature & StandardEventsFeature & SuiFeatures
>;

export interface ChangeAccountSubscriberParams {
  name: string;
}
