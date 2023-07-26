import type { SignClient } from '@walletconnect/sign-client/dist/types/client';
import type { ProposalTypes, SessionTypes } from '@walletconnect/types';
import type { BlockchainMeta, CosmosBlockchainMeta } from 'rango-types/lib';

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
  network: string;
  meta: BlockchainMeta[];
}

export interface CosmosMeta extends CosmosBlockchainMeta {
  // forcing the chainId to be `string` only.
  chainId: string;
}
