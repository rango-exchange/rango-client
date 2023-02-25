import { BestRouteResponse } from 'rango-sdk';
import React, { PropsWithChildren } from 'react';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { RetryIcon, GasIcon } from '../../components/Icon';
import { SecondaryPage } from '../../components/SecondaryPage/';
import { StepDetail } from '../../components/StepDetail';
import { Typography } from '../../components/Typography';
import { styled } from '../../theme';

export const Line = styled('div', {
  width: '0',
  marginLeft: '$12',
  height: '36px',
  border: '1px dashed $foreground',
  borderRadius: 'inherit',
});
export const SwapperContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  marginLeft: '6px',
});
export const BodyError = styled('div', {
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
export const ErrorMsg = styled(Typography, {
  color: '$error',
});
export const Fee = styled('div', {
  display: 'flex',
  alignItems: 'center',
});
export const SwapperLogo = styled('img', {
  width: '$16',
  height: '$16',
});
export const RelativeContainer = styled('div', {
  position: 'relative',
});

export const Footer = styled('div', {
  display: 'flex',
  alignItems: 'center',
});
export const Dot = styled('div', {
  width: '$8',
  height: '$8',
  backgroundColor: '$foreground',
  borderRadius: '4px',
  marginLeft: '$8',
});
export const ArrowDown = styled('div', {
  width: '0px',
  height: '0px',
  borderLeft: '5px solid transparent',
  borderRight: '5px solid transparent',
  borderTop: '5px solid $foreground',
  marginLeft: '$8',
});
export const UpdateIcon = styled(RetryIcon, {
  position: 'absolute',
  right: '0',
});
export const StyledUpdateIcon = styled(UpdateIcon, {
  cursor: 'pointer',
});

const Alerts = styled('div', { paddingBottom: '$16' });

export interface PropTypes {
  bestRoute: BestRouteResponse | null;
  onBack: () => void;
  onConfirm?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  loading?: boolean;
  error?: string;
  warning?: string;
}
export function ConfirmSwap({
  bestRoute,
  onBack,
  onConfirm,
  loading,
  error,
  warning,
}: PropsWithChildren<PropTypes>) {
  return (
    <SecondaryPage
      textField={false}
      title="Swap"
      onBack={onBack}
      Footer={
        <Footer>
          <Button
            type="primary"
            fullWidth
            loading={loading}
            variant="contained"
            onClick={onConfirm}
          >
            Swap
          </Button>
        </Footer>
      }
      Content={bestRoute?.result?.swaps.map((swap, index) => (
        <>
          <Alerts>
            {error && <Alert description={error} type="error" />}
            {warning && <Alert description={warning} type="warning" />}
          </Alerts>
          {index === 0 && (
            <RelativeContainer>
              <StepDetail
                logo={swap.from.logo}
                symbol={swap.from.symbol}
                chainLogo={swap.from.blockchainLogo}
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
                <GasIcon />
                <Typography ml={4} variant="caption">
                  {parseFloat(swap.fee[0].amount).toFixed(6)} estimated gas fee
                </Typography>
              </Fee>
            </div>
          </SwapperContainer>
          <Line />
          {index + 1 === bestRoute.result?.swaps.length && <ArrowDown />}
          <StepDetail
            logo={swap.to.logo}
            symbol={swap.to.symbol}
            chainLogo={swap.to.blockchainLogo}
            blockchain={swap.to.blockchain}
            amount={swap.toAmount}
          />
        </>
      ))}
    />
  );
}
