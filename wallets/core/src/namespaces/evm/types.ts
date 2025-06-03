import type { AddEthereumChainParameter, EIP1193Provider } from './eip1193.js';
import type { AccountsWithActiveChain } from '../../types/accounts.js';
import type {
  AutoImplementedActionsByRecommended,
  CommonActions,
} from '../common/types.js';
import type { TransactionRequest, TransactionResponse } from 'ethers';

export interface EvmActions
  extends AutoImplementedActionsByRecommended,
    CommonActions {
  getInstance: () => EIP1193Provider | undefined;
  connect: (chain?: Chain | ChainId) => Promise<AccountsWithActiveChain>;
  canEagerConnect: () => Promise<boolean>;
  signMessage: (message: string) => Promise<string>;
  sendTransaction: (
    tx: TransactionRequest,
    address: string,
    chainId: string | null
  ) => Promise<TransactionResponse>;
  getTransaction: (hash: string) => Promise<null | TransactionResponse>;
}

export type { EIP1193Provider as ProviderAPI } from './eip1193.js';

// A 0x-prefixed hexadecimal string
export type ChainId = string;
export type Chain = AddEthereumChainParameter;
