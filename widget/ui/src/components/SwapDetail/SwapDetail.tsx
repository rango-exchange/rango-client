import type { PendingSwap } from '../../containers/History/types';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { limitDecimalPlaces } from '../../helper';
import { styled } from '../../theme';
import { Button } from '../Button';
import { Divider } from '../Divider';
import { ArrowRightIcon } from '../Icon';
import { Spinner } from '../Spinner';

import { Token } from './Token';

const Container = styled('div', {
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '$16 0',
  borderBottom: '1px solid $neutral100',

  '& > .info': {
    display: 'flex',
    alignItems: 'center',
  },

  '.status': {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '$12',
  },

  '&.failed .status': {
    color: '$error',
  },
  '&.success .status': {
    color: '$success',
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
      fullWidth
      onClick={onClick.bind(null, swap.requestId)}>
      <Container className={`${status}`}>
        <div className="info">
          <Token
            data={{
              token: {
                logo: firstStep.fromLogo,
                symbol: firstStep.fromSymbol,
              },
              blockchain: {
                logo: firstStep.fromBlockchainLogo || '',
                name: firstStep.fromBlockchain,
              },
              amount: limitDecimalPlaces(swap.inputAmount),
            }}
          />
          <Divider size={12} direction="horizontal" />
          <ArrowRightIcon size={12} />
          <Divider size={12} direction="horizontal" />
          <Token
            data={{
              token: {
                logo: lastStep.toLogo,
                symbol: lastStep.toSymbol,
              },
              blockchain: {
                logo: lastStep.toBlockchainLogo || '',
                name: lastStep.toBlockchain,
              },
              amount: limitDecimalPlaces(lastStep.outputAmount || ''),
              estimatedAmount: limitDecimalPlaces(
                lastStep.expectedOutputAmountHumanReadable || ''
              ),
            }}
          />
        </div>
        <div className={`status`}>
          {status === 'running' ? (
            <Spinner size={24} color="primary" />
          ) : (
            status
          )}
        </div>
      </Container>
    </Button>
  );
}
