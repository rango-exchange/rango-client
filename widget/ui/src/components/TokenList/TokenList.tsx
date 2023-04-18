import React, { forwardRef, useEffect, useState } from 'react';
import { CommonProps } from 'react-window';
import { Asset, Token } from 'rango-sdk';
import { VirtualizedList } from '../VirtualizedList/VirtualizedList';
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

  const innerElementType: React.FC<CommonProps> = forwardRef(
    ({ style, ...rest }, ref) => {
      return (
        <div
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={ref as any}
          style={{
            ...style,
            height: `${parseFloat(style?.height as string) + 8 * 2}px`,
          }}
          {...rest}
        />
      );
    }
  );

  return (
    <VirtualizedList
      Item={({ index, style }) => (
        <TokenItem
          token={tokens[index]}
          style={style}
          onClick={changeSelected}
          selected={isSelected(tokens[index])}
        />
      )}
      hasNextPage={hasNextPage}
      itemCount={tokens.length}
      loadNextPage={loadNextPage}
      innerElementType={innerElementType}
      size={56}
    />
  );
}
