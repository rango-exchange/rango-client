import type { PropTypes } from './HeaderButtons.types';

import { i18n } from '@lingui/core';
import { Tooltip, WalletIcon } from '@rango-dev/ui';
import React from 'react';

import { ConnectedIcon, HeaderButton } from './HeaderButtons.styles';

function WalletButton(props: PropTypes) {
  return (
    <Tooltip
      container={props.container}
      side="top"
      content={i18n.t('Connect Wallet')}>
      <HeaderButton variant="ghost" size="small" onClick={props.onClick}>
        {props.isConnected && <ConnectedIcon />}
        <WalletIcon size={18} color="black" />
      </HeaderButton>
    </Tooltip>
  );
}

export { WalletButton };
