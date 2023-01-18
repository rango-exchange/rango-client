import React, { PropsWithChildren } from 'react';
import Button from '../../components/Button';
import { AngleLeft, Retry, Gas, AddWallet } from '../../components/Icon';
import StepDetail from '../../components/StepDetail';
import Tooltip from '../../components/Tooltip';
import Typography from '../../components/Typography';
import { styled } from '../../theme';
import { SwapResult } from '../types';
import { BestRouteType } from '../types';

const Container = styled('div', {
  padding: '$18 $22',
});

const TitleContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});
const Line = styled('div', {
  width: '0',
  marginLeft: '$12',
  height: '36px',
  border: '1px dashed $foreground',
  borderRadius: 'inherit',
});
const SwapperContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  marginLeft: '6px',
});

const Fee = styled('div', {
  display: 'flex',
  alignItems: 'center',
});
const SwapperLogo = styled('img', {
  width: '$16',
  height: '$16',
});
const RelativeContainer = styled('div', {
  position: 'relative',
});
const Body = styled('div', {
  marginTop: '$30',
  marginBottom: '$16',
});
const Footer = styled('div', {
  display: 'flex',
  alignItems: 'center',
});
const Dot = styled('div', {
  width: '$8',
  height: '$8',
  backgroundColor: '$foreground',
  borderRadius: '4px',
  marginLeft: '$8',
});
const ArrowDown = styled('div', {
  width: '0px',
  height: '0px',
  borderLeft: '5px solid transparent',
  borderRight: '5px solid transparent',
  borderTop: '5px solid $foreground',
  marginLeft: '$8',
});

const SwapButton = styled(Button, {
  marginLeft: '$12',
  width: '100%',
});
export interface PropTypes {
  bestRoute: BestRouteType;
  handleUpdateRoute:
    | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | undefined;
  handleBack:
    | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | undefined;
  handleAddWallet:
    | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | undefined;
  handleSwap:
    | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | undefined;
  loading: boolean;
}
function ConfirmSwap({
  bestRoute,
  handleUpdateRoute,
  handleBack,
  handleAddWallet,
  handleSwap,
  loading,
}: PropsWithChildren<PropTypes>) {
  return (
    <Container>
      <TitleContainer>
        <Button
          variant="ghost"
          onClick={handleBack}
          prefix={<AngleLeft size={24} />}
        />
        <Typography variant="h4">Swap</Typography>
        <Button
          variant="ghost"
          onClick={handleUpdateRoute}
          prefix={<Retry size={24} />}
        />
      </TitleContainer>
      <Body>
        {bestRoute.result?.swaps.map((swap: SwapResult, index: number) => (
          <>
            {index === 0 && (
              <RelativeContainer>
                <StepDetail
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
            <SwapperContainer>
              <SwapperLogo src={swap.swapperLogo} alt={swap.swapperId} />
              <div>
                <Typography ml={4} variant="caption">
                  {swap.swapperType} from {swap.from.symbol} to {swap.to.symbol}{' '}
                  via {swap.swapperId}{' '}
                </Typography>
                <Fee>
                  <Gas />
                  <Typography ml={4} variant="caption">
                    {parseFloat(swap.fee[0].amount).toFixed(6)} estimated gas
                    fee
                  </Typography>
                </Fee>
              </div>
            </SwapperContainer>
            <Line />
            {index + 1 === bestRoute.result?.swaps.length && <ArrowDown />}
            <StepDetail
              logo={swap.to.logo}
              symbol={swap.to.symbol}
              chainLogo={swap.to.blockchainlogo}
              blockchain={swap.to.blockchain}
              amount={swap.toAmount}
            />
          </>
        ))}
      </Body>
      <Footer>
        <Tooltip side="bottom" content="send to a different wallet">
          <Button
            variant="contained"
            prefix={<AddWallet size={24} color="white" />}
            onClick={handleAddWallet}
          />
        </Tooltip>

        <SwapButton loading={loading} variant="contained" onClick={handleSwap}>
          swap
        </SwapButton>
      </Footer>
    </Container>
  );
}

export default ConfirmSwap;
