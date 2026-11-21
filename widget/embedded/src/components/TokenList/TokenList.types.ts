import type { TokenItemOverrides } from '../../modes';
import type { Token } from 'rango-sdk';
import type { ReactElement } from 'react';

export type TokenData = Token &
  (Token & { customToken?: boolean; warning?: boolean; sectionId?: string });

export type TokenListHeader = { kind: 'header'; id: string; title: string };

export type TokenListRow = TokenData | 'skeleton' | TokenListHeader;

export interface PropTypes {
  list: TokenListRow[];
  searchedFor?: string;
  onChange?: (token: Token) => void;
  selectedBlockchain?: string;
  type: 'source' | 'destination' | 'custom-token';
  action?: (token: Token) => ReactElement;
  showTitle?: boolean;
  showWarning?: boolean;
  // Lets the current mode override tags and description of a token item.
  getItemOverrides?: (token: TokenData) => TokenItemOverrides | null;
}

export interface LoadingTokenListProps {
  size: number;
}

export interface RenderDescProps {
  name?: string | null;
  // Name is set by the mode (e.g. issuer · liquidity) and gets more room than a token name.
  wideName?: boolean;
  address: string;
  url: string;
  token: Token;
  customCssForTag: TagCSS;
  customCssForTagTitle: TitleCSS;
}

type TagCSS = {
  [x: string]:
    | string
    | {
        $$color?: string;
      }
    | undefined;
  $$color?: string;
  backgroundColor: string;
};

type TitleCSS = {
  [x: string]:
    | string
    | {
        $$color?: string;
      }
    | undefined;
  $$color?: string;
  color: string;
};
