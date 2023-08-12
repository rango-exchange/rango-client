import type { LoadingStatus } from '../../types/meta';
import type { ConnectedWallet } from '../../types/wallet';
import type { PropsWithChildren } from 'react';

import { i18n } from '@lingui/core';
import React from 'react';

import { AddWalletIcon, Button, Image, Spinner, Typography } from '../..';
import { styled } from '../../theme';

const Container = styled('div', {
  display: 'flex',
  width: '100%',
  justifyContent: 'end',
  '.balance': {
    display: 'flex',
  },
});

const WalletImages = styled('div', {
  display: 'flex',
  paddingLeft: '12px',
});

const WalletImageContainer = styled('div', {
  marginLeft: -15,
  marginRight: '$6',
  '& img': {
    borderRadius: '50%',
  },
});

interface HeaderLayoutProps {
  loadingStatus: LoadingStatus;
  connectedWalletsImages: string[];
  connectedWallets: ConnectedWallet[];
  totalBalance: string;
  fetchingBalance: boolean;
  onClick: () => void;
}
export function HeaderLayout({
  connectedWalletsImages,
  loadingStatus,
  connectedWallets,
  totalBalance,
  fetchingBalance,
  onClick,
  children,
}: PropsWithChildren<HeaderLayoutProps>) {
  return (
    <>
      <Container>
        <Button
          size="small"
          suffix={<AddWalletIcon size={20} />}
          variant="ghost"
          flexContent
          loading={loadingStatus === 'loading'}
          disabled={loadingStatus === 'failed'}
          onClick={onClick}
          prefix={
            connectedWalletsImages?.length ? (
              <WalletImages>
                {connectedWalletsImages.map((walletImage) => (
                  <WalletImageContainer key={`wallet-image-${walletImage}`}>
                    <Image src={walletImage} size={24} />
                  </WalletImageContainer>
                ))}
              </WalletImages>
            ) : null
          }>
          <div className="balance">
            <Typography variant="body" size="small">
              {!connectedWallets?.length
                ? i18n.t('Connect Wallet')
                : `$${totalBalance || '0'}`}
            </Typography>
            {fetchingBalance && <Spinner />}
          </div>
        </Button>
      </Container>
      {children}
    </>
  );
}
