import React, { PropsWithChildren } from 'react';
import { Arrow, Failed, Running, Success } from '../../components/Icon';
import StepDetail from '../../components/StepDetail';
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
const StatusContainer = styled('div', {
  position: 'absolute',
  right: '-10px',
  top: '35%',
});
const RelativeContainer = styled('div', {
  position: 'relative',
});

const Group = styled(Typography, {
  marginBottom: '$xxxl',
});
const GroupTitle = styled(Typography, {
  color: '$text03',
});

export interface PropTypes {
  swaps: PendingSwap[];
}

function History({ swaps }: PropsWithChildren<PropTypes>) {
  const swapsInGroup = swaps.reduce(
    (acc: Array<{ title: string; swaps: PendingSwap[] }>, swap) => {
      const categoryIndex = acc.findIndex(
        (item) =>
          (swap.status === 'running' && item.title == 'Active Swaps') ||
          (swap.status !== 'running' && item.title == 'Recent Swaps')
      );
      if (categoryIndex > -1) {
        acc[categoryIndex].swaps.push(swap);
      } else {
        acc.push({
          title: swap.status === 'running' ? 'Active Swaps' : 'Recent Swaps',
          swaps: [swap],
        });
      }
      return acc;
    },
    []
  );

  return (
    <Container>
      <Typography variant="h4">History</Typography>
      <input
        style={{ margin: '22px 0', width: '100%' }}
        placeholder="search by blockchain or token"
      />
      {swapsInGroup.map((group) => (
        <Group>
          <GroupTitle>{group.title}</GroupTitle>
          {group.swaps.map((swap: PendingSwap) => {
            const firstStep = swap.steps[0];
            const lastStep = swap.steps[swap.steps.length - 1];
            return (
              <RelativeContainer>
                <SwapContainer status={swap.status}>
                  <StepDetail
                    logo={firstStep.fromLogo}
                    symbol={firstStep.fromSymbol}
                    chainLogo={firstStep.fromBlockchainLogo}
                    blockchain={firstStep.fromBlockchain}
                    amount={swap.inputAmount}
                  />

                  <Arrow />

                  <StepDetail
                    logo={lastStep.fromLogo}
                    symbol={lastStep.fromSymbol}
                    chainLogo={lastStep.fromBlockchainLogo}
                    blockchain={lastStep.fromBlockchain}
                    amount={lastStep.outputAmount}
                  />
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
        </Group>
      ))}
    </Container>
  );
}

export default History;
