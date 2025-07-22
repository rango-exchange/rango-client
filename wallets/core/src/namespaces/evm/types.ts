import type { AddEthereumChainParameter, EIP1193Provider } from './eip1193.js';
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
}

export type ProviderAPI = EIP1193Provider;
// A 0x-prefixed hexadecimal string
export type ChainId = string;
export type Chain = AddEthereumChainParameter;

export type ConnectOptions = {
  switchOrAddNetwork?: (instance: ProviderAPI, chain: ChainId | Chain) => void;
};
