import React, { PropsWithChildren } from 'react';
import { styled } from '../../theme';
import Typography from '../Typography';

const StepLogoContainer = styled('div', {
  position: 'relative',
  width: '28px',
  height: '28px',
  variants: {
    direction: {
      vertical: {
        margin: 'auto',
      },
    },
  },
});
const Logo = styled('img', {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
});

const ChainLogo = styled('img', {
  position: 'absolute',
  bottom: 0,
  width: '12px',
  height: '12px',
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
        justifyContent: 'center',
      },
    },
  },
});
const Detail = styled('div', {
  paddingLeft: '$m',
});
const SubTitle = styled(Typography, {
  color: '$text03',
});
export interface PropTypes {
  logo: string;
  chainLogo: string;
  amount: string;
  symbol: string;
  blockchain: string;
  direction?: 'horizontal' | 'vertical';
}

function StepDetail({
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
      <Detail>
        <Typography noWrap variant={direction === 'vertical' ? 'legal' : 'h5'}>
          {parseFloat(amount).toFixed(3)} {symbol}
        </Typography>
        <SubTitle noWrap variant="footnote2">
          on {blockchain}
        </SubTitle>
      </Detail>
    </StepContainer>
  );
}

export default StepDetail;
