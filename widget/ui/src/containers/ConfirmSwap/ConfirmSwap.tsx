import { BestRouteResponse } from 'rango-sdk';
import React, { Fragment, PropsWithChildren, ReactNode } from 'react';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { RetryIcon, GasIcon } from '../../components/Icon';
import { SecondaryPage } from '../../components/SecondaryPage/';
import { StepDetail } from '../../components/StepDetail';
import { Typography } from '../../components/Typography';
import { styled } from '../../theme';

const MainContainer = styled('div', {
  overflow: 'hidden',
});

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

const BestRouteContainer = styled('div', {
  overflow: 'auto',
});

const Alerts = styled('div', { paddingBottom: '$16' });

export interface PropTypes {
  bestRoute: BestRouteResponse | null;
  onRefresh?: React.MouseEventHandler<SVGElement>;
  confirmButtonTitle: string;
  confirmButtonDisabled: boolean;
  onBack: () => void;
  onConfirm?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  loading?: boolean;
  errors?: ReactNode[];
  warnings?: ReactNode[];
  extraMessages?: ReactNode;
}
export function ConfirmSwap(props: PropsWithChildren<PropTypes>) {
  const {
    bestRoute,
    onRefresh,
    onBack,
    onConfirm,
    loading,
    errors,
    warnings,
    extraMessages,
    confirmButtonTitle,
    confirmButtonDisabled,
  } = props;

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
            disabled={confirmButtonDisabled}
          >
            {confirmButtonTitle}
          </Button>
        </Footer>
      }
      TopButton={<StyledUpdateIcon size={24} onClick={onRefresh} />}
    >
      <MainContainer>
        <div>
          {extraMessages || null}
          <Alerts>
            {errors?.map((error) => (
              <Alert type="error">{error}</Alert>
            ))}
            {/* {error && warnings && <Spacer direction="vertical" size={16} />} */}
            {warnings?.map((warning) => (
              <Alert type="warning">{warning}</Alert>
            ))}
          </Alerts>
        </div>
        <BestRouteContainer>
          {bestRoute?.result?.swaps.map((swap, index) => (
            <Fragment key={index}>
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
                    {swap.swapperType} from {swap.from.symbol} to{' '}
                    {swap.to.symbol} via {swap.swapperId}{' '}
                  </Typography>
                  <Fee>
                    <GasIcon />
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
                chainLogo={swap.to.blockchainLogo}
                blockchain={swap.to.blockchain}
                amount={swap.toAmount}
              />
            </Fragment>
          ))}
        </BestRouteContainer>
      </MainContainer>
    </SecondaryPage>
  );
}
