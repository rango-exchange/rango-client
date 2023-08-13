import type { PropTypes, TokenWithAmount } from './TokenList.types';
import type { CommonProps } from 'react-window';

import React, { forwardRef, useEffect, useState } from 'react';

import { Row } from '../Row';
import { Typography } from '../Typography';
import { VirtualizedList } from '../VirtualizedList/VirtualizedList';

import { Suffix } from './TokenList.styles';

const PAGE_SIZE = 20;
const Fixed_Height = 16;
const ZERO = 0;

export function TokenList(props: PropTypes) {
  const { list, searchedText, onChange } = props;
  // const [selected, setSelected] = useState(props.selected);

  /*
   * const isSelected = (token: Token) => {
   *   if (multiSelect && selectedList) {
   *     return (
   *       selectedList
   *         .map((item) => item.symbol + item.address)
   *         .indexOf(token.symbol + token.address) > -1
   *     );
   *   }
   *   return (
   *     selected?.symbol === token.symbol && selected?.address === token.address
   *   );
   * };
   */

  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [tokens, setTokens] = useState<TokenWithAmount[]>(list);

  const loadNextPage = () => {
    setTokens(list.slice(ZERO, tokens.length + PAGE_SIZE));
  };

  useEffect(() => {
    setTokens(list.slice(ZERO, PAGE_SIZE));
  }, [searchedText, list]);

  useEffect(() => {
    setHasNextPage(list.length > tokens.length);
  }, [tokens.length]);

  // eslint-disable-next-line react/display-name
  const innerElementType: React.FC<CommonProps> = forwardRef((render, ref) => {
    return (
      <div
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        {...render}
        style={{
          ...render.style,
          height: `${
            parseFloat(render.style?.height as string) + Fixed_Height
          }px`,
        }}
      />
    );
  });

  return (
    <VirtualizedList
      Item={({ index, style }) => (
        <div
          key={index}
          style={{
            ...style,
            top: `${parseFloat(style?.top as string)}px`,
          }}>
          <Row
            suffix={
              tokens[index].balance?.amount && (
                <Suffix>
                  <Typography variant="title" size="small">
                    {tokens[index].balance?.amount}
                  </Typography>
                  <div />
                  <Typography variant="body" color="neutral400" size="xsmall">
                    {`$${tokens[index].balance?.usdValue}`}
                  </Typography>
                </Suffix>
              )
            }
            image={tokens[index].image}
            title={tokens[index].symbol}
            subTitle={tokens[index].name || undefined}
            tag={tokens[index].blockchain}
            onClick={onChange.bind(null, tokens[index])}
          />
        </div>
      )}
      hasNextPage={hasNextPage}
      itemCount={tokens.length}
      loadNextPage={loadNextPage}
      innerElementType={innerElementType}
      size={56}
    />
  );
}
