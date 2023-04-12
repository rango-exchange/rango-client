import React, { Fragment, PropsWithChildren } from 'react';
import { GasIcon, TimeIcon } from '../../components/Icon';
import { StepDetail } from '../../components/StepDetail';
import { Typography } from '../../components/Typography';
import { keyframes, styled } from '../../theme';
import { Skeleton } from '../Skeleton';
import { Spinner } from '../Spinner';
import { BestRouteResponse } from 'rango-sdk';
import { Tooltip } from '../Tooltip';

const Container = styled('div', {
  borderRadius: '$5',
  border: '1px solid $neutrals300',
  display: 'flex',
  alignItems: 'center',
  minHeight: 126,
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

export const pulse = keyframes({
  '0%': {
    opacity: 1,
  },
  '50%': {
    opacity: 0.3,
  },
  '100%': {
    opacity: 1,
  },
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

const FeeContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  variants: {
    warning: {
      true: {
        animation: `${pulse} 2s ease-in-out infinite`,
      },
    },
  },
});

const TotalFee = styled(Typography, {
  variants: {
    warning: {
      true: {
        color: '$warning300',
      },
    },
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
  data: BestRouteResponse | null;
  totalFee: string;
  feeWarning: boolean;
  totalTime: string;
  loading?: boolean;
  error?: string;
}
export function BestRoute(props: PropsWithChildren<PropTypes>) {
  const { data, loading, error, totalFee, feeWarning, totalTime } = props;
  return (
    <Container>
      {loading ? (
        <SkeletonContainer>
          <Skeleton width={48} height={94} />
        </SkeletonContainer>
      ) : (
        <GasContainer>
          <Tooltip content="Transaction cost (fee)">
            <FeeContainer warning={feeWarning}>
              <GasIcon size={20} color={feeWarning ? 'warning' : undefined} />
              <TotalFee
                mt={4}
                align="center"
                variant="caption"
                warning={feeWarning}
              >
                {error && '-'}
                {!!data && `$${totalFee}`}
              </TotalFee>
            </FeeContainer>
          </Tooltip>
          <HR />
          <Tooltip content="Time estimate">
            <TimeIcon size={20} />
            <Typography mt={4} align="center" variant="caption">
              {error && '-'}
              {!!data && `~${totalTime}m`}
            </Typography>
          </Tooltip>
        </GasContainer>
      )}
      <BestRouteContainer>
        {loading && <Spinner color="primary" />}

        {error && <ErrorMsg variant="caption">{error}</ErrorMsg>}

        {!!data &&
          data.result?.swaps.map((swap, index) => (
            <Fragment key={index}>
              {index === 0 && (
                <RelativeContainer>
                  <StepDetail
                    direction="vertical"
                    logo={swap.from.logo}
                    symbol={swap.from.symbol}
                    chainLogo={swap.from.blockchainLogo}
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
                chainLogo={swap.to.blockchainLogo}
                blockchain={swap.to.blockchain}
                amount={swap.toAmount}
              />
            </Fragment>
          ))}
        {!!data && !data?.result && (
          <Typography variant="body2">No routes found</Typography>
        )}
      </BestRouteContainer>
    </Container>
  );
}
