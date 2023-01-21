import React, { PropsWithChildren } from 'react';
import { CheckCircle, InfoCircle, TryAgain } from '../../components/Icon';
import SecondaryPage from '../../components/PageWithTextField/SecondaryPage';
// import { Arrow } from '../../components/Icon';
import StepDetail from '../../components/StepDetail';
import Typography from '../../components/Typography';
import { styled } from '../../theme';
import { PendingSwap } from './types';

const Container = styled('div', {
  padding: '$18 $22',
});
const Arrow = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
const Line = styled('div', {
  height: '0',
  width: '$48',
  border: '1px dashed $foreground',
  borderRadius: 'inherit',
});
const Dot = styled('div', {
  width: '$8',
  height: '$8',
  backgroundColor: '$foreground',
  borderRadius: '4px',
  marginLeft: '$8',
});
const ArrowRight = styled('div', {
  width: '0px',
  height: '0px',
  borderTop: '5px solid transparent',
  borderBottom: '5px solid transparent',
  borderLeft: '5px solid $foreground',
});
const SwapContainer = styled('div', {
  padding: '$12',
  marginTop: '$8',
  border: '1px solid',
  display: 'flex',
  borderRadius: '$5',
  justifyContent: 'space-between',
  '&:hover': {
    background: '$neutrals300',
    border: 0,
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
const StatusContainer = styled('div', {
  position: 'absolute',
  right: '-10px',
  top: '35%',
  background: '$background',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
});
const RelativeContainer = styled('div', {
  position: 'relative',
});

const Group = styled('div', {
  marginBottom: '$24',
  paddingRight: '$10',
});
const GroupTitle = styled(Typography, {
  color: '$neutrals500',
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
    <SecondaryPage
      textField={true}
      textFieldPlaceholder="Search By Blockchain Or Token"
      title="History"
      Content={() => (
        <>
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
                      {swap.status === 'running' ? (
                        <TryAgain size={20} />
                      ) : swap.status === 'failed' ? (
                        <InfoCircle size={20} color="error" />
                      ) : (
                        <CheckCircle size={20} color="success" />
                      )}
                    </StatusContainer>
                  </RelativeContainer>
                );
              })}
            </Group>
          ))}
        </>
      )}
    />
  );
}

export default History;
//  <Container>
//       <Typography variant="h4">History</Typography>
//       <input
//         style={{ margin: '22px 0', width: '100%' }}
//         placeholder="search by blockchain or token"
//       />
//       {swapsInGroup.map((group) => (
//         <Group>
//           <GroupTitle>{group.title}</GroupTitle>
//           {group.swaps.map((swap: PendingSwap) => {
//             const firstStep = swap.steps[0];
//             const lastStep = swap.steps[swap.steps.length - 1];
//             return (
//               <RelativeContainer>
//                 <SwapContainer status={swap.status}>
//                   <StepDetail
//                     logo={firstStep.fromLogo}
//                     symbol={firstStep.fromSymbol}
//                     chainLogo={firstStep.fromBlockchainLogo}
//                     blockchain={firstStep.fromBlockchain}
//                     amount={swap.inputAmount}
//                   />
//                   <Arrow>
//                     <Dot />
//                     <Line />
//                     <ArrowRight />
//                   </Arrow>
//                   <StepDetail
//                     logo={lastStep.fromLogo}
//                     symbol={lastStep.fromSymbol}
//                     chainLogo={lastStep.fromBlockchainLogo}
//                     blockchain={lastStep.fromBlockchain}
//                     amount={lastStep.outputAmount}
//                   />
//                 </SwapContainer>
//                 <StatusContainer>
//                   {swap.status === 'running' ? (
//                     <TryAgain size={20} color="black" />
//                   ) : swap.status === 'failed' ? (
//                     <InfoCircle size={20} color="error" />
//                   ) : (
//                     <CheckCircle size={20} color="success" />
//                   )}
//                 </StatusContainer>
//               </RelativeContainer>
//             );
//           })}
//         </Group>
//       ))}
//     </Container>
