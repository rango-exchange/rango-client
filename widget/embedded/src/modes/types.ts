import type { TradeDirection } from '../store/quote';
import type { AppStoreState } from '../store/slices/types';
import type { BlockchainMeta, Token } from 'rango-sdk';

export type SwapItemType = 'source' | 'destination';

export type TokenListSection = {
  id: string;
  // A section without title is rendered without header.
  title?: string;
  tokens: Token[];
};

export type TokenItemTag = {
  label: string;
  // `blockchain` is tinted with the blockchain color, `bridge` is green (token is routed from another chain).
  variant: 'blockchain' | 'bridge';
};

export type TokenItemOverrides = {
  tags?: TokenItemTag[];
  // Replaces the token name. Like the name, it turns into the contract address on hover.
  name?: string;
};

export type ModeContext = {
  store: AppStoreState;
  direction: TradeDirection;
};

/**
 * Each swap mode (swap, refuel, stocks) describes its differences through a strategy,
 * so components don't need to branch on the mode itself.
 */
export interface ModeStrategy {
  allowCustomTokens: boolean;
  blockchains: (ctx: ModeContext & { type: SwapItemType }) => BlockchainMeta[];
  tokenSections: (
    ctx: ModeContext & {
      type: SwapItemType;
      blockchain?: BlockchainMeta | null;
      searchFor: string;
    }
  ) => TokenListSection[];
  tokenItem: (
    ctx: ModeContext & { token: Token; sectionId?: string }
  ) => TokenItemOverrides | null;
  title: (
    ctx: ModeContext & { fromToken: Token | null; toToken: Token | null }
  ) => string;
  chainLabel: (
    ctx: ModeContext & {
      token: Token | null;
      blockchain: BlockchainMeta | null;
    }
  ) => string;
}
