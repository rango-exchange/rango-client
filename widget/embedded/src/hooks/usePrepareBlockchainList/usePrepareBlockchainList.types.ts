import type { BlockchainMeta } from 'rango-sdk';

export interface PrepareListOptions {
  limit?: number;
  selected?: string;
}

export interface PrepareOutput {
  list: BlockchainMeta[];
  more: BlockchainMeta[];
}

export interface UsePrepareList {
  list: PrepareOutput['list'];
  more: PrepareOutput['more'];
  history: string[];
}
