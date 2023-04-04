import React, { PropsWithChildren } from 'react';
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

const ChainLogo = styled('img', {
  position: 'absolute',
  bottom: 0,
  width: '$12',
  height: '$12',
  right: 0,
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
  color: '$neutrals600',
});
export interface PropTypes {
  logo: string;
  chainLogo: string;
  amount: string;
  symbol: string;
  blockchain: string;
  direction?: 'horizontal' | 'vertical';
}

export function StepDetail({
  logo,
  chainLogo,
  amount,
  symbol,
  blockchain,
  direction = 'horizontal',
}: PropsWithChildren<PropTypes>) {
  return (
    <StepContainer direction={direction}>
      <StepLogoContainer direction={direction}>
        <Logo src={logo} alt={symbol} />
        <ChainLogo src={chainLogo} alt={blockchain} />
      </StepLogoContainer>
      <Detail pl={direction === 'horizontal'}>
        <Typography noWrap variant={direction === 'vertical' ? 'body2' : 'h6'}>
          {amount ? parseFloat(amount).toFixed(2) : '?'} {symbol}
        </Typography>
        <SubTitle noWrap variant="caption">
          on {blockchain}
        </SubTitle>
      </Detail>
    </StepContainer>
  );
}
