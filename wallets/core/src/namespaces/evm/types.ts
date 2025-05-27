import type { AddEthereumChainParameter } from './eip1193.js';
import type { Provider } from '../../mod.js';
import type { AccountsWithActiveChain } from '../../types/accounts.js';
import type {
  AutoImplementedActionsByRecommended,
  CommonActions,
} from '../common/types.js';

export interface EvmActions
  extends AutoImplementedActionsByRecommended,
    CommonActions {
  connect: (chain?: Chain | ChainId) => Promise<AccountsWithActiveChain>;
  canEagerConnect: () => Promise<boolean>;
  canSwitchNetwork: (params: CanSwitchNetworkParams) => boolean;
}
type CanSwitchNetworkParams = {
  network: string;
  provider?: Provider;
};

export type { EIP1193Provider as ProviderAPI } from './eip1193.js';

// A 0x-prefixed hexadecimal string
export type ChainId = string;
export type Chain = AddEthereumChainParameter;
