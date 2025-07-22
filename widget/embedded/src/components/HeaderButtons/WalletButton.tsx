import type { PropTypes } from './HeaderButtons.types';

import { i18n } from '@lingui/core';
import { Image, Tooltip, WalletIcon } from '@arlert-dev/ui';
import React from 'react';

import { useWalletList } from '../../hooks/useWalletList';

import {
  ConnectedIcon,
  HeaderButton,
  rowStyles,
  WalletImageContainer,
} from './HeaderButtons.styles';

function WalletButton(props: PropTypes) {
  const { list } = useWalletList();
  const connectedWallets = list.filter(
    (wallet) => wallet.state === 'connected'
  );
  const content = !connectedWallets.length ? (
    i18n.t('Connect Wallet')
  ) : (
    <div className={rowStyles()}>
      {connectedWallets.map((wallet) => (
        <WalletImageContainer key={wallet.title}>
          <Image src={wallet.image} size={14} />
        </WalletImageContainer>
      ))}
    </div>
  );

  return (
    <Tooltip container={props.container} side="bottom" content={content}>
      <HeaderButton
        id="widget-header-wallet-icon-btn"
        variant="ghost"
        size="small"
        onClick={props.onClick}>
        {props.isConnected && <ConnectedIcon />}
        <WalletIcon size={18} color="black" />
      </HeaderButton>
    </Tooltip>
  );
}

export { WalletButton };
