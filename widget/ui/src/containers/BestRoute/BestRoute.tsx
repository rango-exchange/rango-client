import React, { PropsWithChildren } from 'react';
import { Gas, Time } from '../../components/Icon';
import StepDetail from '../../components/StepDetail';
import Typography from '../../components/Typography';
import { styled } from '../../theme';
import { SwapResult } from '../types';
import { BestRouteType } from '../types';

const Container = styled('div', {
  padding: '$8',
  borderRadius: '$5',
  border: '1px solid $neutrals300',
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
  width: '$36',
  border: '1px dashed $foreground',
  borderRadius: 'inherit',
});
const HR = styled('hr', {
  width: '100%',
  background: '$neutrals200',
  margin: '$8 0',
});
const SwapperLogo = styled('img', {
  width: '$16',
  height: '$16',
});
const RelativeContainer = styled('div', {
  position: 'relative',
});

const Dot = styled('div', {
  width: '$8',
  height: '$8',
  backgroundColor: '$foreground',
  borderRadius: '4px',
  position: 'absolute',
  top: '44%',
  right: -8,
  marginLeft: '$8',
});
const ArrowRight = styled('div', {
  width: '0px',
  height: '0px',
  borderTop: '5px solid transparent',
  borderBottom: '5px solid transparent',
  borderLeft: '5px solid $foreground',
});

const GasContainer = styled('div', {
  backgroundColor: '$neutrals300',
  borderRadius: '5px',
  padding: '$8',
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
        <Gas size={20} />
        <Typography mt={4} align="center" variant="caption">
          ${rawFees.toFixed(3)}
        </Typography>
        <HR />
        <Time size={20} />
        <Typography mt={4} align="center" variant="caption">
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
            {index + 1 === bestRoute.result?.swaps.length && <ArrowRight />}
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
