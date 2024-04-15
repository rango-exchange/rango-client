import type {
  AccountsWithActiveChain,
  AutoImplementedActionsByRecommended,
  CommonActions,
} from '../common/types';

export interface EvmActions
  extends AutoImplementedActionsByRecommended,
    CommonActions {
  connect: (chain?: Chain | ChainId) => Promise<AccountsWithActiveChain>;
}

export type { EIP1193Provider as NamespaceProvider } from 'viem';

// A 0x-prefixed hexadecimal string
export type ChainId = string;
export type Chain = {
  chainId: ChainId;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
};
