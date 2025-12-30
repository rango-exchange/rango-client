import type { AddEthereumChainParameter, EIP1193Provider } from './eip1193.js';
import type { AccountsWithActiveChain } from '../../types/accounts.js';
import type {
  AutoImplementedActionsByRecommended,
  CommonActions,
} from '../common/types.js';
import type { BlockchainMeta } from 'rango-types';

export interface EvmActions
  extends AutoImplementedActionsByRecommended,
    CommonActions {
  connect: (
    chain?: Chain | ChainId,
    options?: ConnectOptions
  ) => Promise<AccountsWithActiveChain>;
  canEagerConnect: () => Promise<boolean>;
  canSwitchNetwork: (params: CanSwitchNetworkParams) => boolean;
  getChainId: () => Promise<`0x${string}`>;
}
type CanSwitchNetworkParams = {
  network: string;
  supportedChains: BlockchainMeta[];
};

export type ProviderAPI = EIP1193Provider;
// A 0x-prefixed hexadecimal string
export type ChainId = string;
export type Chain = AddEthereumChainParameter;
export type ProviderAccounts = {
  accounts: string[];
  chainId: ChainId;
};
export type ConnectOptions = {
  switchOrAddNetwork?: (instance: ProviderAPI, chain: ChainId | Chain) => void;
  getAccounts?: (provider: ProviderAPI) => Promise<ProviderAccounts>;
  derivationPath?: string;
};
