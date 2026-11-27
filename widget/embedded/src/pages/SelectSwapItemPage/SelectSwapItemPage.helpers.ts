import type { TokenList } from '../../components/TokenList';
import type { TokenListSection } from '../../modes';
import type { Token } from 'rango-sdk';
import type { ComponentProps } from 'react';

import {
  MAX_TOKENS_BEFORE_FETCH,
  MIN_SEARCH_LENGTH,
} from './SelectSwapItemPage.constants';

export function getTokenSelectionMethod(
  searchedFor: string
): 'search' | 'default ' {
  if (searchedFor.trim()) {
    return 'search';
  }
  return 'default ';
}

export function shouldSearchForCustomTokens(
  metaSearchResultTokens: Token[],
  query: string,
  blockchain?: string
) {
  if (
    blockchain &&
    metaSearchResultTokens.length === 1 &&
    metaSearchResultTokens[0]?.address === query
  ) {
    return false;
  }
  return (
    metaSearchResultTokens.length < MAX_TOKENS_BEFORE_FETCH &&
    query.trim().length >= MIN_SEARCH_LENGTH
  );
}

/**
 * Flattens sections into a single list of rows (headers + tokens),
 * so the token list can still render them in one virtualized list.
 * Sections without tokens are skipped.
 */
export function flattenTokenSections(
  sections: TokenListSection[]
): ComponentProps<typeof TokenList>['list'] {
  return sections.flatMap((section) => {
    if (!section.tokens.length) {
      return [];
    }
    const tokens = section.tokens.map((token) => ({
      ...token,
      sectionId: section.id,
    }));

    return section.title
      ? [
          { kind: 'header' as const, id: section.id, title: section.title },
          ...tokens,
        ]
      : tokens;
  });
}

export function prepareTokensList(
  tokens: ComponentProps<typeof TokenList>['list'],
  metaTokens: Token[],
  customTokens: Token[],
  query: string,
  loading: boolean,
  blockchain?: string
) {
  let modifiedList: ComponentProps<typeof TokenList>['list'] = [...tokens];

  if (shouldSearchForCustomTokens(metaTokens, query, blockchain)) {
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
