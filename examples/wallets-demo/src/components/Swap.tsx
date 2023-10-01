import type { BlockchainMeta, Token } from 'rango-sdk';

import { Image, styled, Typography } from '@rango-dev/ui';
import { ArrowRightIcon } from '@rango-dev/ui/src/components/Icon';
import React from 'react';

interface swap {
  blockchain?: BlockchainMeta;
  token: string;
  addresse: string;
  amount: string;
}
interface PropTypes {
  from?: swap;
  to?: swap;
  tokens: Token[];
}

const Box = styled('div', {
  padding: '$16',
  display: 'flex',
  flexDirection: 'row',
  textAlign: 'center',
  alignItems: 'center',
});

const Content = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '0 $10',
});

export function SwapComponent(props: PropTypes) {
  const { from, to, tokens } = props;
  const fromToken = tokens
    .filter((token) => token.blockchain === from?.blockchain?.name)
    .find((token) => token.symbol === from?.token);
  const toToken = tokens
    .filter((token) => token.blockchain === to?.blockchain?.name)
    .find((token) => token.symbol === to?.token);
  return (
    <Box>
      {!!from && (
        <Content>
          <Image size={54} src={fromToken?.image} />
          <Typography variant="body" mt={12} size="medium">
            {from.token}
          </Typography>
          <div />
          <Typography variant="body" size="medium">
            from {from.blockchain?.name}
          </Typography>
          <div />
          <Typography variant="body" size="medium">
            {from.amount}
          </Typography>
        </Content>
      )}

      <ArrowRightIcon size={32} color="black" />

      {!!to && (
        <Content>
          <Image size={54} src={toToken?.image} />
          <Typography variant="body" size="medium" mt={12}>
            {to.token}
          </Typography>
          <div />
          <Typography variant="body" size="medium">
            from {to.blockchain?.name}
          </Typography>
          <div />
          <Typography variant="body" size="medium">
            -
          </Typography>
        </Content>
      )}
    </Box>
  );
}
