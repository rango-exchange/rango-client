import React, { PropsWithChildren } from 'react';
import { styled } from '../../theme';
import { Typography } from '../Typography';
import { Image } from '../common';

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

const ChainLogo = styled('div', {
  position: 'absolute',
  right: -4,
  bottom: -4,
  width: '$16',
  height: '$16',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '$background',
  border: '1px solid $neutrals400',
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
  display: 'block',
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
        <Image src={logo} alt={symbol} size={28} />
        <ChainLogo>
          <Image src={chainLogo} alt={blockchain} size={12} />
        </ChainLogo>
      </StepLogoContainer>
      <Detail pl={direction === 'horizontal'}>
        <Typography noWrap variant={direction === 'vertical' ? 'body2' : 'h6'}>
          {amount ? parseFloat(amount).toFixed(2) : '?'} {symbol}
        </Typography>
        <SubTitle noWrap variant="caption" color="neutrals800">
          on {blockchain}
        </SubTitle>
      </Detail>
    </StepContainer>
  );
}
