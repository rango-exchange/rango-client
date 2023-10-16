import type { Token } from 'rango-sdk';

export interface TokenWithBalance extends Token {
  balance?: {
    amount: string;
    usdValue: string;
  };
}

export interface PropTypes {
  list: TokenWithBalance[];
  searchedFor?: string;
  onChange: (token: TokenWithBalance) => void;
  selectedBlockchain?: string;
}

export interface LoadingTokenListProps {
  size: number;
}

export interface RenderDescProps {
  name?: string | null;
  address: string;
  url: string;
  token: TokenWithBalance;
  customCssForTag: TagCSS;
  customCssForTagTitle: TitleCSS;
}

type TagCSS = {
  [x: string]:
    | string
    | {
        $$color: string;
      };
  $$color: string;
  backgroundColor: string;
};
type TitleCSS = {
  [x: string]:
    | string
    | {
        $$color: string;
      };
  $$color: string;
  color: string;
};
