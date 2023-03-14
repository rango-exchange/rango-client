import React, { forwardRef, useEffect, useState } from 'react';
import { CommonProps } from 'react-window';
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
  selected?: TokenWithAmount | null;
  searchedText: string;
  onChange: (token: TokenWithAmount) => void;
  multiSelect?: boolean;
  selectedList?: TokenWithAmount[] | 'all';
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

const paginateTokens = (list: Token[], outputCount?: number) => {
  return list.slice(0, outputCount);
};

export function TokenList(props: PropTypes) {
  const { list, searchedText, onChange, multiSelect, selectedList } = props;

  const [selected, setSelected] = useState(props.selected);

  const changeSelected = (token: TokenWithAmount) => {
    setSelected(token);
    onChange(token);
  };

  const isSelect = (token: Token) => {
    if (multiSelect && selectedList) {
      return (
        selectedList === 'all' ||
        selectedList
          .map((item) => item.symbol + item.address)
          .indexOf(token.symbol + token.address) > -1
      );
    }
    return (
      selected?.symbol === token.symbol && selected?.address === token.address
    );
  };

  const Token = ({
    token,
    style,
  }: {
    token: TokenWithAmount;
    style: CSSProperties | undefined;
  }) => (
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
        onClick={changeSelected.bind(null, token)}
        type={isSelect(token) ? 'primary' : undefined}
        prefix={<TokenImage src={token.image} />}
        suffix={
          token.balance?.amount && (
            <TokenAmountContainer>
              <Typography variant="body2">{token.balance.amount}</Typography>
              <Typography variant="caption">
                {`${token.balance.usdValue}$`}
              </Typography>
            </TokenAmountContainer>
          )
        }
      >
        <TokenNameContainer>
          <Typography variant="body1">{token.symbol}</Typography>
          <Typography variant="body2">{token.name}</Typography>
        </TokenNameContainer>
      </Button>
    </div>
  );

  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [tokens, setTokens] = useState<TokenWithAmount[]>(list);

  const loadNextPage = () => {
    setTokens(paginateTokens(list, tokens.length + PAGE_SIZE));
  };

  useEffect(() => {
    setTokens(paginateTokens(list, PAGE_SIZE));
  }, [searchedText]);

  useEffect(() => {
    setHasNextPage(paginateTokens(list).length > paginateTokens.length);
  }, [tokens.length]);

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
          <Token token={tokens[index]} style={style} />
        )}
        hasNextPage={hasNextPage}
        itemCount={tokens.length}
        loadNextPage={loadNextPage}
        innerElementType={innerElementType}
        size={56}
      />
    </div>
  );
}
