import type { Token } from 'rango-sdk';
import type { ReactElement } from 'react';

export interface PropTypes {
  list: Token[];
  searchedFor?: string;
  onChange?: (token: Token) => void;
  selectedBlockchain?: string;
  type: 'source' | 'destination' | 'custom-token';
  action?: (token: Token) => ReactElement;
  showTitle?: boolean;
}

export interface LoadingTokenListProps {
  size: number;
}

export interface RenderDescProps {
  name?: string | null;
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
