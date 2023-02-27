import React, { forwardRef, useEffect, useState } from 'react';
import { CommonProps } from 'react-window';
import { containsText } from '../../helpers';
import { styled } from '../../theme';
import { Token } from 'rango-sdk';
import { Button } from '../Button/Button';
import { Typography } from '../Typography';
import { VirtualizedList } from '../VirtualizedList/VirtualizedList';
import { CSSProperties } from '@stitches/react';

export interface TokenWithAmount extends Token {
  balance?: {
    amount: string;
    usdValue: string;
  };
}

const PAGE_SIZE = 20;
export interface PropTypes {
  list: TokenWithAmount[];
  selected: TokenWithAmount | null;
  searchedText: string;
  onChange: (token: TokenWithAmount) => void;
}

const TokenImage = styled('img', {
  width: '$32',
  maxHeight: '$32',
  marginRight: '$16',
});

const TokenNameContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});

const TokenAmountContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
});

export function TokenList(props: PropTypes) {
  const { list, searchedText, onChange } = props;

  const [selected, setSelected] = useState(props.selected);

  const changeSelected = (token: TokenWithAmount) => {
    setSelected(token);
    onChange(token);
  };

  const Token = ({
    filteredTokens,
    index,
    style,
  }: {
    filteredTokens: TokenWithAmount[];
    index: number;
    style: CSSProperties | undefined;
  }) => {
    const currentToken = filteredTokens[index];
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          ...style,
          height: '48px',
          top: `${parseFloat(style?.top as string) + 0}px`,
        }}
      >
        <Button
          variant="outlined"
          size="large"
          align="start"
          onClick={changeSelected.bind(null, currentToken)}
          type={
            selected?.symbol === currentToken.symbol &&
            selected?.address === currentToken.address
              ? 'primary'
              : undefined
          }
          prefix={<TokenImage src={currentToken.image} />}
          suffix={
            currentToken.balance?.amount && (
              <TokenAmountContainer>
                <Typography variant="body2">
                  {currentToken.balance.amount}
                </Typography>
                <Typography variant="caption">
                  {`${currentToken.balance.usdValue}$`}
                </Typography>
              </TokenAmountContainer>
            )
          }
        >
          <TokenNameContainer>
            <Typography variant="body1">{currentToken.symbol}</Typography>
            <Typography variant="body2">{currentToken.name}</Typography>
          </TokenNameContainer>
        </Button>
      </div>
    );
  };

  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState<boolean>(false);
  const [filteredTokens, setFilteredTokens] = useState<TokenWithAmount[]>(list);

  const loadNextPage = () => {
    setIsNextPageLoading(true);
    setTimeout(() => {
      setIsNextPageLoading(false);
      setFilteredTokens(list.slice(0, filteredTokens.length + PAGE_SIZE));
    }, 0);
  };

  useEffect(() => {
    setFilteredTokens(
      list.filter(
        (token) =>
          containsText(token.symbol, searchedText) ||
          containsText(token.address || '', searchedText) ||
          containsText(token.name || '', searchedText)
      )
    );
  }, [searchedText]);

  useEffect(() => {
    setHasNextPage(list.length > filteredTokens.length);
  }, [filteredTokens.length]);

  useEffect(() => {
    setFilteredTokens(list.slice(0, PAGE_SIZE));
  }, []);

  const innerElementType: React.FC<CommonProps> = forwardRef(
    ({ style, ...rest }, ref) => {
      return (
        <div
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={ref as any}
          style={{
            ...style,
            // eslint-disable-next-line react/prop-types
            height: `${parseFloat(style?.height as string) + 8 * 2}px`,
          }}
          {...rest}
        />
      );
    }
  );
  return (
    <div style={{ height: '450px' }}>
      <VirtualizedList
        Item={({ index, style }) => (
          <Token filteredTokens={filteredTokens} style={style} index={index} />
        )}
        hasNextPage={hasNextPage}
        isNextPageLoading={isNextPageLoading}
        itemCount={filteredTokens.length}
        loadNextPage={loadNextPage}
        innerElementType={innerElementType}
        size={56}
      />
    </div>
  );
}
