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
  padding: '$xxl $xl',
});
const Title = styled('div', {
  fontSize: '$xl',
  fontWeight: '$xl',
});
const TitleContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});
const Line = styled('div', {
  width: '0',
  marginLeft: '$l',

  height: '36px',
  border: '1px dashed $black',
  borderRadius: 'inherit',
  zIndex: -1,
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
  width: '$s',
  height: '$s',
});
const RelativeContainer = styled('div', {
  position: 'relative',
});
const Body = styled('div', {
  marginTop: '30px',
  marginBottom: '16px',
});
const Footer = styled('div', {
  display: 'flex',
  alignItems: 'center',
});
const Dot = styled('div', {
  width: '8px',
  height: '8px',
  backgroundColor: '$black',
  borderRadius: '4px',
  marginLeft: '9px',
});
const ArrowDown = styled('div', {
  width: '0px',
  height: '0px',
  borderLeft: '5px solid transparent',
  borderRight: '5px solid transparent',
  borderTop: '5px solid $black',
  marginLeft: '8px',
});
const Detail = styled('div', {
  paddingLeft: '$m',
  color: '$text03',
});
const GasLogo = styled(Gas, {
  marginRight: '$m',
});
const SwapButton = styled(Button, {
  marginLeft: '$l',
});
export interface PropTypes {
  bestRoute: BestRouteType;
  handleUpdateRoute: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | undefined;
  handleBack: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | undefined;
  handleAddWallet: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | undefined;
  handleSwap: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
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
          variant="text"
          onClick={handleBack}
          startIcon={<AngleLeft size={24} />}
        />
        <Title>Swap</Title>
        <Button
          variant="text"
          onClick={handleUpdateRoute}
          startIcon={<Retry size={24} />}
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
              <Detail>
                <Typography variant="legal">
                  {swap.swapperType} from {swap.from.symbol} to {swap.to.symbol}{' '}
                  via {swap.swapperId}{' '}
                </Typography>
                <Fee>
                  <GasLogo width={12} height={12} />
                  <Typography variant="footnote2">
                    {parseFloat(swap.fee[0].amount).toFixed(6)} estimated gas
                    fee
                  </Typography>
                </Fee>
              </Detail>
            </SwapperContainer>
            <Line />
            <ArrowDown />
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
            startIcon={<AddWallet width={28} height={28} />}
            onClick={handleAddWallet}
          />
        </Tooltip>

        <SwapButton loading={loading} variant="contained" onClick={handleSwap} fullWidth={true}>
          swap
        </SwapButton>
      </Footer>
    </Container>
  );
}

export default ConfirmSwap;
