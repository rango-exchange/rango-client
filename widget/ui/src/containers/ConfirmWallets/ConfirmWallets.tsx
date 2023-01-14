import React, { PropsWithChildren } from 'react';
import Button from '../../components/Button';
import { AngleLeft, Retry, AddWallet } from '../../components/Icon';
import RadioWalletGroup from '../../components/RadioWalletGroup';
import Tooltip from '../../components/Tooltip';
import Typography from '../../components/Typography';
import { styled } from '../../theme';
import { BestRouteType } from '../types';
import { ActiveWalletsType } from './types';

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

const Body = styled('div', {
  marginTop: '30px',
  marginBottom: '16px',
});
const Footer = styled('div', {
  display: 'flex',
  alignItems: 'center',
});

const SwapButton = styled(Button, {
  marginLeft: '$l',
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
  wallets: ActiveWalletsType[];
}

function ConfirmWallets({
  bestRoute,
  handleUpdateRoute,
  handleBack,
  handleAddWallet,
  handleSwap,
  loading,
  wallets,
}: PropsWithChildren<PropTypes>) {
  const firstStep = bestRoute.result?.swaps[0];
  const lastStep = bestRoute.result?.swaps[bestRoute.result?.swaps.length - 1];
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
        <Typography variant="h5" noWrap>
          Confirm swap {parseFloat(firstStep?.fromAmount || '0').toFixed(4)}{' '}
          {lastStep?.from.symbol} ({firstStep?.from.blockchain}) to{' '}
          {parseFloat(lastStep?.toAmount || '0').toFixed(4)}{' '}
          {lastStep?.to.symbol} (on {lastStep?.to.blockchain})
        </Typography>
        {wallets.map((wallet: ActiveWalletsType, index: number) => (
          <div>
            <Typography variant="legal">
              {index + 1}) your {wallet.type} wallet
            </Typography>
            <RadioWalletGroup wallet={wallet} />
          </div>
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

        <SwapButton
          loading={loading}
          variant="contained"
          onClick={handleSwap}
          fullWidth={true}
        >
          swap
        </SwapButton>
      </Footer>
    </Container>
  );
}

export default ConfirmWallets;
