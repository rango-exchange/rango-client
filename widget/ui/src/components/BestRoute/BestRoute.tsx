import React, { PropsWithChildren } from 'react';
import { Gas, Time } from '../../components/Icon';
import StepDetail from '../../components/StepDetail';
import Typography from '../../components/Typography';
import { BestRouteType, SwapResult } from '../../types/swaps';
import {
  RawFees,
  SecondsToString,
  TotalArrivalTime,
} from '../../helper';
import { styled } from '../../theme';
import Skeleton from '../Skeleton';
import Spinner from '../Spinner';

const Container = styled('div', {
  borderRadius: '$5',
  border: '1px solid $neutrals300',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const ErrorMsg = styled(Typography, {
  color: '$error',
});
const BestRouteContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  margin: '0 auto',
  overflowX: 'auto',
  overflowY: 'hidden',
  alignSelf: 'stretch',
  padding: '$4',
  '@md': {
    padding: '$8',
  },
});
const Line = styled('div', {
  height: '0',
  width: '$20',
  border: '1px dashed $foreground',
  borderRadius: 'inherit',
  '@lg': {
    width: '$32',
  },
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
  width: '$6',
  height: '$6',
  backgroundColor: '$foreground',
  position: 'absolute',
  top: '45%',
  right: -5,
  marginLeft: '$8',
  borderRadius: '50%',
  '@md': {
    width: '$8',
    height: '$8',
    right: -8,
    top: '45%',
  },
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
  margin: '$4',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '$4',
  '@md': {
    padding: '$8',
    margin: '$8',
  },
});
const SkeletonContainer = styled('div', {
  padding: '$4',
  '@md': {
    padding: '$8',
  },
});
const SwapperContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export interface PropTypes {
  data: BestRouteType;
  loading?: boolean;
  error?: string;
}
function BestRoute({ data, loading, error }: PropsWithChildren<PropTypes>) {
  const fee = RawFees(data);
  const time = SecondsToString(TotalArrivalTime(data));
  return (
    <Container>
      {loading ? (
        <SkeletonContainer>
          <Skeleton width={36} height={48} />
        </SkeletonContainer>
      ) : (
        <GasContainer>
          <Gas size={20} />
          <Typography mt={4} align="center" variant="caption">
            {error ? '-' : `$${fee}`}
          </Typography>
          <HR />
          <Time size={20} />
          <Typography mt={4} align="center" variant="caption">
            {error ? '-' : `~${time}m`}
          </Typography>
        </GasContainer>
      )}
      <BestRouteContainer>
        {loading ? (
          <Spinner color="primary" />
        ) : error ? (
          <ErrorMsg variant="caption">{error}</ErrorMsg>
        ) : (
          data.result?.swaps.map((swap: SwapResult, index: number) => (
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
              <SwapperContainer>
                <Line />
                <SwapperLogo src={swap.swapperLogo} alt={swap.swapperId} />
                <Line />
              </SwapperContainer>

              {index + 1 === data.result?.swaps.length && <ArrowRight />}
              <StepDetail
                direction="vertical"
                logo={swap.to.logo}
                symbol={swap.to.symbol}
                chainLogo={swap.to.blockchainlogo}
                blockchain={swap.to.blockchain}
                amount={swap.toAmount}
              />
            </>
          ))
        )}
      </BestRouteContainer>
    </Container>
  );
}

export default BestRoute;
