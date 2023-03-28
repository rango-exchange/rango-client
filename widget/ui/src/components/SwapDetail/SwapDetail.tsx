import React, { PropsWithChildren } from 'react';
import { PendingSwap } from '../../containers/History/types';
import { styled } from '../../theme';
import { Button } from '../Button';
import { CheckCircleIcon, InfoCircleIcon, TryAgainIcon } from '../Icon';
import { StepDetail } from '../StepDetail';

const Container = styled('div', {
  position: 'relative',
});

const ButtonContainer = styled('div', {
  paddingTop: '$8',
});
const SwapContainer = styled('div', {
  display: 'flex',
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
  onClick: (requestId: string) => void;
}

export function SwapDetail({
  swap,
  status,
  onClick,
}: PropsWithChildren<PropTypes>) {
  const firstStep = swap.steps[0];
  const lastStep = swap.steps[swap.steps.length - 1];

  return (
    <Container onClick={onClick.bind(null, swap.requestId)}>
      <ButtonContainer>
        <Button
          variant="outlined"
          align="grow"
          size="large"
          type={
            status === 'failed'
              ? 'error'
              : status === 'success'
              ? 'success'
              : undefined
          }
        >
          <SwapContainer>
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
              logo={lastStep.toLogo}
              symbol={lastStep.toSymbol}
              chainLogo={lastStep.toBlockchainLogo}
              blockchain={lastStep.toBlockchain}
              amount={lastStep.outputAmount}
            />
          </SwapContainer>
        </Button>
      </ButtonContainer>
      <StatusContainer>
        {status === 'running' ? (
          <TryAgainIcon size={16} />
        ) : status === 'failed' ? (
          <InfoCircleIcon size={18} color="error" />
        ) : (
          <CheckCircleIcon size={18} color="success" />
        )}
      </StatusContainer>
    </Container>
  );
}
