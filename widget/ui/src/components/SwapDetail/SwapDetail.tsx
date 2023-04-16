import React, { PropsWithChildren } from 'react';
import { PendingSwap } from '../../containers/History/types';
import { styled } from '../../theme';
import { Button } from '../Button';
import { ArrowRightIcon } from '../Icon';
import { Spacer } from '../Spacer';
import { Token } from './Token';

const Container = styled('div', {
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '$16 0',
  borderBottom: '1px solid $neutrals300',

  '& > .info': {
    display: 'flex',
    alignItems: 'center',
  },

  '.status': {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '$12',
  },

  '.status.failed': {
    color: '$error',
  },
  '.status.success': {
    color: '$success',
  },
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
    <Button
      variant="ghost"
      size="free"
      fullWidth
      onClick={onClick.bind(null, swap.requestId)}
    >
      <Container>
        <div className="info">
          <Token
            data={{
              token: {
                logo: firstStep.fromLogo,
                symbol: firstStep.fromSymbol,
              },
              blockchain: {
                logo: firstStep.fromBlockchainLogo,
                name: firstStep.fromBlockchain,
              },
              amount: swap.inputAmount,
            }}
          />
          <Spacer size={12} />
          <ArrowRightIcon size={12} />
          <Spacer size={12} />
          <Token
            data={{
              token: {
                logo: lastStep.toLogo,
                symbol: lastStep.toSymbol,
              },
              blockchain: {
                logo: lastStep.toBlockchainLogo,
                name: lastStep.toBlockchain,
              },
              amount:
                lastStep.outputAmount ||
                lastStep.expectedOutputAmountHumanReadable ||
                '',
            }}
          />
        </div>
        <div className={`status ${status}`}>{status}</div>
      </Container>
    </Button>
  );
}
