import type { BlockchainMeta } from 'rango-sdk';

export interface PrepareListOptions {
  limit?: number;
  selected?: string;
}

export interface PrepareListOutput {
  list: BlockchainMeta[];
  more: BlockchainMeta[];
  history: string[];
}
