import type { Accounts } from '../common/mod.js';
import type {
  AutoImplementedActionsByRecommended,
  CommonActions,
} from '../common/types.js';

import { type AssetList, type Chain } from '@chain-registry/types';

export type CosmosChain = Chain;
export type CosmosAssetList = AssetList;
export interface CosmosActions
  extends AutoImplementedActionsByRecommended,
    CommonActions {
  connect: (options?: ConnectOptions) => Promise<Accounts>;
  suggest: (chain: CosmosChain, assetList: AssetList) => Promise<void>;
  canEagerConnect: () => Promise<boolean>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ProviderAPI = Record<string, any>;
export type CosmosChainAccounts = {
  accounts: string[];
  chainId: string;
};

export type ConnectOptions = {
  chainIds: string[];
  /**
   * For chains that may not be natively supported by the provider.
   */
  customChainIds?: string[];
};
