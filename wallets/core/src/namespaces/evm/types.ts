import type { AddEthereumChainParameter } from './eip1193.js';
import type { AccountsWithActiveChain } from '../../types/accounts.js';
import type {
  AutoImplementedActionsByRecommended,
  CommonActions,
} from '../common/types.js';

export interface EvmActions
  extends AutoImplementedActionsByRecommended,
    CommonActions {
  connect: (
    chain?: Chain | ChainId,
    derivationPath?: string
  ) => Promise<AccountsWithActiveChain>;
  canEagerConnect: () => Promise<boolean>;
}

export type { EIP1193Provider as ProviderAPI } from './eip1193.js';

// A 0x-prefixed hexadecimal string
export type ChainId = string;
export type Chain = AddEthereumChainParameter;
