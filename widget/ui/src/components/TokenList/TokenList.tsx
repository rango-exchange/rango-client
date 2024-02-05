/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { Asset, Token } from 'rango-sdk';

import React, { useEffect, useState } from 'react';

import { VirtualizedList } from '../VirtualizedList';

import { TokenItem } from './TokenItem';

export interface TokenWithAmount extends Token {
  balance?: {
    amount: string;
    usdValue: string;
  };
}

const PAGE_SIZE = 20;
export interface PropTypes {
  list: TokenWithAmount[];
  selected?: TokenWithAmount | null;
  searchedText: string;
  onChange: (token: TokenWithAmount) => void;
  multiSelect?: boolean;
  selectedList?: Asset[];
}
/**
 * @deprecated will be removed in v2
 */
export function TokenList(props: PropTypes) {
  const { list, searchedText, onChange, multiSelect, selectedList } = props;
  const [selected, setSelected] = useState(props.selected);

  const changeSelected = (token: TokenWithAmount) => {
    setSelected(token);
    onChange(token);
  };

  const isSelected = (token: Token) => {
    if (multiSelect && selectedList) {
      return (
        selectedList
          .map((item) => item.symbol + item.address)
          .indexOf(token.symbol + token.address) > -1
      );
    }
    return (
      selected?.symbol === token.symbol && selected?.address === token.address
    );
  };

  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [tokens, setTokens] = useState<TokenWithAmount[]>(list);

  const loadNextPage = () => {
    setTokens(list.slice(0, tokens.length + PAGE_SIZE));
  };

  useEffect(() => {
    setTokens(list.slice(0, PAGE_SIZE));
  }, [searchedText, list]);

  useEffect(() => {
    setHasNextPage(list.length > tokens.length);
  }, [tokens.length]);

  return (
    <VirtualizedList
      itemContent={(index) => (
        <TokenItem
          token={tokens[index]}
          onClick={changeSelected}
          selected={isSelected(tokens[index])}
        />
      )}
      totalCount={tokens.length}
      endReached={hasNextPage ? loadNextPage : undefined}
    />
  );
}
