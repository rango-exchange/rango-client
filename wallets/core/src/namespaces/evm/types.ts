import type {
  Accounts,
  AutoImplementedActionsByRecommended,
  CommonActions,
} from '../common/types';

export interface EvmActions
  extends AutoImplementedActionsByRecommended,
    CommonActions {
  connect: (chain?: string) => Promise<Accounts>;
}

export type { EIP1193Provider as NamespaceProvider } from 'viem';
