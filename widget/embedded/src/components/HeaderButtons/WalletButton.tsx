import type { PropTypes } from './HeaderButtons.types';

import { i18n } from '@lingui/core';
import { Tooltip, WalletIcon } from '@rango-dev/ui';
import React from 'react';

import { HeaderButton } from './HeaderButtons.styles';

function WalletButton(props: PropTypes) {
  return (
    <Tooltip side="bottom" content={i18n.t('Connect Wallet')}>
      <HeaderButton variant="ghost" size="xsmall" onClick={props.onClick}>
        <WalletIcon size={18} color="black" />
      </HeaderButton>
    </Tooltip>
  );
}

export { WalletButton };
