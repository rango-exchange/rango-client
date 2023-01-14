import React, { PropsWithChildren } from 'react';
import { Gas, Time } from '../../components/Icon';
import StepDetail from '../../components/StepDetail';
import Typography from '../../components/Typography';
import { styled } from '../../theme';
import { SwapResult } from '../types';
import { BestRouteType } from '../types';

const Container = styled('div', {
  padding: '$s',
  borderRadius: '5px',
  border: '1px solid $neutral01',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});
const BestRouteContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
});
const Line = styled('div', {
  height: '0',
  width: '36px',
  border: '1px dashed $black',
  borderRadius: 'inherit',
});

const SwapperLogo = styled('img', {
  width: '$s',
  height: '$s',
});
const RelativeContainer = styled('div', {
  position: 'relative',
});

const Dot = styled('div', {
  width: '8px',
  height: '8px',
  backgroundColor: '$black',
  borderRadius: '4px',
  position: 'absolute',
  top: '43%',
  right: -8,
  marginLeft: '9px',
});
const ArrowRight = styled('div', {
  width: '0px',
  height: '0px',
  borderTop: '5px solid transparent',
  borderBottom: '5px solid transparent',
  borderLeft: '5px solid $black',
});

const GasContainer = styled('div', {
  backgroundColor: '$neutral02',
  borderRadius: '5px',
  padding: '$s',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

export interface PropTypes {
  bestRoute: BestRouteType;
}
function BestRoute({ bestRoute }: PropsWithChildren<PropTypes>) {
  const secondsToString = (s: number): string => {
    const minutes = parseInt((s / 60).toString()).toString();
    return `${minutes}`;
  };
  const totalArrivalTime =
    bestRoute?.result?.swaps?.reduce(
      (a, b) => a + b.estimatedTimeInSeconds,
      0
    ) || 0;
  const rawFees = (
    bestRoute?.result?.swaps?.flatMap((s) =>
      s.fee.map((f) => ({ swapperId: s.swapperId, fee: f }))
    ) || []
  ).reduce((partialSum, a) => partialSum + parseFloat(a.fee.amount), 0);

  return (
    <Container>
      <GasContainer>
        <Gas width={14} height={14} />
        <Typography variant="footnote2">${rawFees.toFixed(3)}</Typography>

        <Time width={14} height={14} />
        <Typography variant="footnote2">
          ~{secondsToString(totalArrivalTime)}m
        </Typography>
      </GasContainer>
      <BestRouteContainer>
        {bestRoute.result?.swaps.map((swap: SwapResult, index: number) => (
          <>
            {index === 0 && (
              <RelativeContainer>
                <StepDetail
                  direction="vertical"
                  logo={swap.from.logo}
                  symbol={swap.from.symbol}
                  chainLogo={swap.from.blockchainlogo}
                  blockchain={swap.from.blockchain}
                  amount={swap.fromAmount}
                />
                <Dot />
              </RelativeContainer>
            )}
            <Line />
            <SwapperLogo src={swap.swapperLogo} alt={swap.swapperId} />

            <Line />
            <ArrowRight />
            <StepDetail
              direction="vertical"
              logo={swap.to.logo}
              symbol={swap.to.symbol}
              chainLogo={swap.to.blockchainlogo}
              blockchain={swap.to.blockchain}
              amount={swap.toAmount}
            />
          </>
        ))}
      </BestRouteContainer>
    </Container>
  );
}

export default BestRoute;
