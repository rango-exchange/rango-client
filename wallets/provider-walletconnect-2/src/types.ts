import type { ProposalTypes } from '@walletconnect/types';
import type { ChainIdParams } from 'caip';
import type { BlockchainMeta } from 'rango-types';

import { SignClient } from '@walletconnect/sign-client';

export { SignClient };

export type SignClientInstance = InstanceType<typeof SignClient>;

export interface Environments {
  WC_PROJECT_ID: string;
  // This is useful for directly opening a listed WC wallet. you will need to pass a url.
  DISABLE_MODAL_AND_OPEN_LINK?: string;
  meta?: BlockchainMeta[];
  themeMode?: 'light' | 'dark';
  modalZIndex?: number;
}

export type WalletConnectNamespace = 'evm' | 'utxo';

export interface CreateSessionParams {
  requiredNamespaces: ProposalTypes.RequiredNamespaces;
  optionalNamespaces?: ProposalTypes.OptionalNamespaces;
  pairingTopic?: string;
}

export interface ConnectParams {
  /**
   * Chains to propose, as CAIP-2 ids. Callers convert rango `BlockchainMeta`
   * at the boundary (see `evmMetaToCaipChainIds`) so the connect path stays
   * decoupled from rango-types' chain shape.
   */
  chains: ChainIdParams[];
  envs: Environments;
  namespace: WalletConnectNamespace;
  /**
   * Decimal EVM chain reference (e.g. `"137"`).
   * When set, the chain is proposed as required during session creation.
   */
  chainReference?: string;
}
