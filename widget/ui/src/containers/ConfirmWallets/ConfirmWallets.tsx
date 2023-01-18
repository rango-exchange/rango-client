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
  padding: '$18 $22',
});

const TitleContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const Body = styled('div', {
  marginTop: '$30',
  marginBottom: '$16',
});
const Footer = styled('div', {
  display: 'flex',
  alignItems: 'center',
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
        <Typography variant="h6" mb={12} noWrap>
          Confirm swap {parseFloat(firstStep?.fromAmount || '0').toFixed(4)}{' '}
          {lastStep?.from.symbol} ({firstStep?.from.blockchain}) to{' '}
          {parseFloat(lastStep?.toAmount || '0').toFixed(4)}{' '}
          {lastStep?.to.symbol} (on {lastStep?.to.blockchain})
        </Typography>
        {wallets.map((wallet: ActiveWalletsType, index: number) => (
          <div>
            <Typography variant="body2" mb={12} mt={12}>
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
            prefix={<AddWallet size={24} color="white" />}
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
