import React, { PropsWithChildren } from 'react';
import { PendingSwap } from '../../containers/History/types';
import { styled } from '../../theme';
import { CheckCircle, InfoCircle, TryAgain } from '../Icon';
import StepDetail from '../StepDetail';

const Container = styled('div', {
  position: 'relative',
});
const SwapContainer = styled('div', {
  padding: '$6',
  marginTop: '$8',
  border: '1px solid',
  display: 'flex',
  borderRadius: '$5',
  justifyContent: 'space-between',
  '@md': {
    padding: '$12',
  },
  '&:hover': {
    borderColor: '$primary',

  },

  variants: {
    status: {
      failed: {
        borderColor: '$error',
      },
      running: {
        borderColor: '$neutrals400',
      },
      success: {
        borderColor: '$success',
      },
    },
  },
});
const Arrow = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
const Line = styled('div', {
  height: '0',
  width: '$20',
  border: '1px dashed $foreground',
  borderRadius: 'inherit',
  '@md': {
    width: '$36',
  },
  '@lg': {
    width: '$48',
  },
});
const Dot = styled('div', {
  width: '$6',
  height: '$6',
  backgroundColor: '$foreground',
  borderRadius: '50%',
  '@lg': {
    width: '$8',
    height: '$8',
  },
});
const ArrowRight = styled('div', {
  width: '0px',
  height: '0px',
  borderTop: '5px solid transparent',
  borderBottom: '5px solid transparent',
  borderLeft: '5px solid $foreground',
});
const StatusContainer = styled('div', {
  position: 'absolute',
  right: '-8px',
  top: '30%',
  background: '$background',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',

  '@md': {
    top: '40%',
    right: '-8px',
  },
});
export interface PropTypes {
  swap: PendingSwap;
  status: 'running' | 'failed' | 'success';
}

function SwapDetail({ swap, status }: PropsWithChildren<PropTypes>) {
  const firstStep = swap.steps[0];
  const lastStep = swap.steps[swap.steps.length - 1];
  return (
    <Container>
      <SwapContainer status={status}>
        <StepDetail
          logo={firstStep.fromLogo}
          symbol={firstStep.fromSymbol}
          chainLogo={firstStep.fromBlockchainLogo}
          blockchain={firstStep.fromBlockchain}
          amount={swap.inputAmount}
        />
        <Arrow>
          <Dot />
          <Line />
          <ArrowRight />
        </Arrow>
        <StepDetail
          logo={lastStep.fromLogo}
          symbol={lastStep.fromSymbol}
          chainLogo={lastStep.fromBlockchainLogo}
          blockchain={lastStep.fromBlockchain}
          amount={lastStep.outputAmount}
        />
      </SwapContainer>
      <StatusContainer>
        {status === 'running' ? (
          <TryAgain size={16} />
        ) : status === 'failed' ? (
          <InfoCircle   size={18} color="error" />
        ) : (
          <CheckCircle size={18} color="success" />
        )}
      </StatusContainer>
    </Container>
  );
}

export default SwapDetail;
