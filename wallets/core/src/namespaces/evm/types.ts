import type {
  AccountsWithActiveChain,
  AutoImplementedActionsByRecommended,
  CommonActions,
} from '../common/types';

export interface EvmActions
  extends AutoImplementedActionsByRecommended,
    CommonActions {
  connect: (chain?: string) => Promise<AccountsWithActiveChain>;
}

export type { EIP1193Provider as NamespaceProvider } from 'viem';
