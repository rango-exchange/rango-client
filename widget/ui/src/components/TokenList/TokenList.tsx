import React, { forwardRef, useEffect, useState } from 'react';
import { CommonProps } from 'react-window';
import { containsText } from '../../helpers';
import { styled } from '../../theme';
import { TokenMeta } from '../../types/meta';
import Button from '../Button/Button';
import Typography from '../Typography';
import VirtualizedList from '../VirtualizedList/VirtualizedList';

export interface PropTypes {
  tokens: TokenMeta[];
  selectedToken: TokenMeta;
  searchedText: string;
  onSelectedTokenChanged: (token: TokenMeta) => void;
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

function TokenList(props: PropTypes) {
  const { tokens, searchedText, onSelectedTokenChanged } = props;

  const [selectedToken, setSelectedToken] = useState(props.selectedToken);

  const changeSelectedToken = (token: TokenMeta) => {
    setSelectedToken(token);
    onSelectedTokenChanged(token);
  };

  const Token = ({
    filteredTokens,
    index,
    style,
  }: {
    filteredTokens: TokenMeta[];
    index: number;
    style: React.CSSProperties | undefined;
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
          onClick={changeSelectedToken.bind(null, currentToken)}
          type={
            selectedToken.symbol === currentToken.symbol &&
            selectedToken.address === currentToken.address
              ? 'primary'
              : undefined
          }
          prefix={<TokenImage src={currentToken.image} />}
          suffix={
            !!currentToken.balance && (
              <TokenAmountContainer>
                <Typography variant="body1">
                  {currentToken.balance.amount}
                </Typography>
                <Typography variant="body2">
                  {currentToken.balance.usdPrice}
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
  const PAGE_SIZE = 10;

  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState<boolean>(false);
  const [filteredTokens, setFilteredTokens] = useState<TokenMeta[]>(tokens);

  const loadNextPage = () => {
    setIsNextPageLoading(true);
    setTimeout(() => {
      setIsNextPageLoading(false);
      setFilteredTokens(tokens.slice(0, filteredTokens.length + PAGE_SIZE));
    }, 100);
  };

  useEffect(() => {
    setFilteredTokens(
      tokens.filter(
        (token) =>
          containsText(token.symbol, searchedText) ||
          containsText(token.address || '', searchedText) ||
          containsText(token.name || '', searchedText)
      )
    );
  }, [searchedText]);

  useEffect(() => {
    setHasNextPage(tokens.length > filteredTokens.length);
  }, [filteredTokens.length]);

  useEffect(() => {
    setFilteredTokens(tokens.slice(0, PAGE_SIZE));
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
    <>
      <VirtualizedList
        Item={({ index, style }) => (
          <Token filteredTokens={filteredTokens} style={style} index={index} />
        )}
        hasNextPage={hasNextPage}
        isNextPageLoading={isNextPageLoading}
        itemCount={filteredTokens.length}
        loadNextPage={loadNextPage}
        focus={1}
        innerElementType={innerElementType}
        size={56}
      />
    </>
  );
}

export default TokenList;
