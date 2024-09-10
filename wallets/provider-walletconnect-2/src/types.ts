import type { SignClient } from '@walletconnect/sign-client/dist/types/client';
import type { ProposalTypes, SessionTypes } from '@walletconnect/types';
import type { BlockchainMeta, CosmosBlockchainMeta } from 'rango-types';

export interface Environments extends Record<string, string | undefined> {
  WC_PROJECT_ID: string;
  // This is useful for directly opening a listed WC wallet. you will need to pass a url.
  DISABLE_MODAL_AND_OPEN_LINK?: string;
}
export interface WCInstance {
  client: SignClient;
  session: SessionTypes.Struct | null;
  request: (params: any) => Promise<string>;
}

export interface CreateSessionParams {
  requiredNamespaces: ProposalTypes.RequiredNamespaces;
  optionalNamespaces?: ProposalTypes.OptionalNamespaces;
  pairingTopic?: string;
}

export interface ConnectParams {
  meta: BlockchainMeta[];
  envs: Environments;
}

export interface CosmosMeta extends CosmosBlockchainMeta {
  // forcing the chainId to be `string` only.
  chainId: string;
}
