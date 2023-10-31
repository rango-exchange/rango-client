import type { PropsWithChildren } from 'react';

import React from 'react';

import { styled } from '../../theme';
import { Typography } from '../Typography';

const StepLogoContainer = styled('div', {
  position: 'relative',
  width: '$28',
  height: '$28',
  variants: {
    direction: {
      vertical: {
        margin: 'auto',
      },
      horizontal: {},
    },
  },
});
const Logo = styled('img', {
  width: '$28',
  height: '$28',
  borderRadius: '50%',
});

const ChainLogo = styled('div', {
  position: 'absolute',
  right: -4,
  bottom: -4,
  width: '$16',
  height: '$16',
  padding: '$2',
  borderRadius: '50%',
  backgroundColor: '$background',
  border: '1px solid $neutral400',

  img: {
    width: '100%',
    display: 'block',
  },
});
const StepContainer = styled('div', {
  display: 'flex',
  variants: {
    direction: {
      horizontal: {
        alignItems: 'center',
      },
      vertical: {
        flexDirection: 'column',
        textAlign: 'center',
        justifyContent: 'center',
      },
    },
    success: {
      true: { filter: 'none' },
      false: {
        filter: 'grayscale(100%)',
      },
    },
  },
});
const Detail = styled('div', {
  variants: {
    pl: {
      true: {
        paddingLeft: '$4',
        '@lg': {
          paddingLeft: '$8',
        },
      },
      false: {
        paddingTop: '$8',
      },
    },
  },
});
const SubTitle = styled(Typography, {
  color: '$neutral800',
  display: 'block',
  paddingLeft: '$8',
});
export interface PropTypes {
  logo: string;
  chainLogo: string;
  amount: string;
  symbol: string;
  blockchain: string;
  estimatedAmount?: string;
  direction?: 'horizontal' | 'vertical';
  success?: boolean;
}

export function StepDetail(props: PropsWithChildren<PropTypes>) {
  const {
    logo,
    chainLogo,
    amount,
    symbol,
    blockchain,
    estimatedAmount,
    success = true,
    direction = 'horizontal',
  } = props;
  return (
    <StepContainer direction={direction} success={success}>
      <StepLogoContainer direction={direction}>
        <Logo src={logo} alt={symbol} />
        <ChainLogo>
          <img src={chainLogo} alt={blockchain} />
        </ChainLogo>
      </StepLogoContainer>
      <Detail pl={direction === 'horizontal'}>
        {amount && (
          <Typography
            noWrap
            variant={direction === 'vertical' ? 'body' : 'title'}
            size="medium">
            {amount}
          </Typography>
        )}
        {!amount && estimatedAmount && (
          <Typography
            noWrap
            variant={direction === 'vertical' ? 'body' : 'title'}
            size="medium"
            color={'$neutral800'}>
            {estimatedAmount}
          </Typography>
        )}
        &nbsp;
        <Typography
          variant={direction === 'vertical' ? 'body' : 'title'}
          size="medium"
          noWrap>
          {symbol}
        </Typography>
        <SubTitle noWrap variant="body" size="xsmall" color="$neutral600">
          on {blockchain}
        </SubTitle>
      </Detail>
    </StepContainer>
  );
}
