import React, { PropsWithChildren } from 'react';
import { Arrow, Failed, Running, Success } from '../../components/Icon';
import Typography from '../../components/Typography';
import { styled } from '../../theme';
import { PendingSwap } from './types';

const Container = styled('div', {
  padding: '$xxl $xl',
});
const SwapContainer = styled('div', {
  padding: '$l',
  marginTop: '$m',
  border: '1px solid',
  display: 'flex',
  borderRadius: '5px',
  justifyContent: 'space-between',
  '&:hover': {
    background: '$neutral02',
    border: 0,
  },

  variants: {
    status: {
      failed: {
        borderColor: '$error',
      },
      running: {
        borderColor: '$pending',
      },
      success: {
        borderColor: '$success',
      },
    },
  },
});
const StepContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
});
const StatusContainer = styled('div', {
  position: 'absolute',
  right: '-10px',
  top: '35%',
});
const Detail = styled('div', {
  paddingLeft: '$m',
});
const RelativeContainer = styled('div', {
  position: 'relative',
});

const Logo = styled('img', {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
});

const SubTitle = styled(Typography, {
  color: '$text03',
});
const ChainLogo = styled('img', {
  position: 'absolute',
  bottom: 3,
  width: '12px',
  height: '12px',
  right: 0,
});
export interface PropTypes {
  swaps: PendingSwap[];
}

function History({ swaps }: PropsWithChildren<PropTypes>) {
  return (
    <Container>
      <Typography variant="h4">History</Typography>
      <input
        style={{ margin: '22px 0', width: '100%' }}
        placeholder="search by blockchain or token"
      />
      {swaps.map((swap: PendingSwap) => {
        const firstStep = swap.steps[0];
        const lastStep = swap.steps[swap.steps.length - 1];
        return (
          <RelativeContainer>
            <SwapContainer status={swap.status}>
              <StepContainer>
                <RelativeContainer>
                  <Logo src={firstStep.fromLogo} alt={firstStep.fromSymbol} />
                  <ChainLogo
                    src={firstStep.fromBlockchainLogo}
                    alt={firstStep.fromBlockchain}
                  />
                </RelativeContainer>
                <Detail>
                  <Typography variant="h5">
                    {swap.inputAmount} {firstStep.fromSymbol}
                  </Typography>
                  <SubTitle variant="body1">
                    on {firstStep.fromBlockchain}
                  </SubTitle>
                </Detail>
              </StepContainer>
              <Arrow />
              <StepContainer>
                <RelativeContainer>
                  <Logo src={lastStep.toLogo} alt={lastStep.toSymbol} />
                  <ChainLogo
                    src={lastStep.toBlockchainLogo}
                    alt={lastStep.toBlockchain}
                  />
                </RelativeContainer>
                <Detail>
                  <Typography variant="h5">
                    {lastStep.outputAmount} {firstStep.toSymbol}
                  </Typography>
                  <SubTitle variant="body1">
                    on {firstStep.toBlockchain}
                  </SubTitle>
                </Detail>
              </StepContainer>
            </SwapContainer>
            <StatusContainer>
              {swap.status === 'running' ? (
                <Running size={24} />
              ) : swap.status === 'failed' ? (
                <Failed size={24} />
              ) : (
                <Success size={20} />
              )}
            </StatusContainer>
          </RelativeContainer>
        );
      })}
    </Container>
  );
}

export default History;
