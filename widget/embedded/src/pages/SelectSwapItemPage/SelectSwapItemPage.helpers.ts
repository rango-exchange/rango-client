import type { TokenList } from '../../components/TokenList';
import type { Token } from 'rango-sdk';
import type { ComponentProps } from 'react';

import {
  MAX_TOKENS_BEFORE_FETCH,
  MIN_SEARCH_LENGTH,
} from './SelectSwapItemPage.constants';

export function shouldSearchForCustomTokens(
  numberOfTokens: number,
  query: string
) {
  return (
    numberOfTokens < MAX_TOKENS_BEFORE_FETCH &&
    query.trim().length >= MIN_SEARCH_LENGTH
  );
}

export function prepareTokensList(
  tokens: Token[],
  customTokens: Token[],
  query: string,
  loading: boolean
) {
  let modifiedList: ComponentProps<typeof TokenList>['list'] = [...tokens];

  if (shouldSearchForCustomTokens(tokens.length, query)) {
    modifiedList = loading
      ? [...modifiedList, 'skeleton', 'skeleton', 'skeleton']
      : [
          ...modifiedList,
          ...customTokens.map((customToken) => ({
            ...customToken,
            customToken: true,
            warning: true,
          })),
        ];
  }

  return modifiedList;
}
