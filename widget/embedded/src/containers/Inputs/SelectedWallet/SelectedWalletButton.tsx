import type { PropTypes } from './SelectedWalletButton.types';

import { Divider, EditIcon, Image, Typography } from '@rango-dev/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { getConciseAddress } from '../../../utils/wallets';

import { WalletButton } from './SelectedWalletButton.styles';

const WALLET_ADDRESS_MAX_CHARS = 4;
const WALLET_ADDRESS_ELLIPSIS_LENGTH = 4;

export function SelectedWalletButton(props: PropTypes) {
  const { onClickWallet, relatedWallet } = props;
  const { t } = useTranslation();
  const address = relatedWallet?.address;
  const image = relatedWallet?.image;

  return (
    <WalletButton onClick={onClickWallet} variant="contained">
      {!relatedWallet && (
        <Typography variant="label" size="medium" color="secondary">
          {t('Connect Wallet')}
        </Typography>
      )}
      {address && (
        <div className="flex">
          {image && (
            <>
              <Image size={16} src={image} />
              <Divider direction="horizontal" size={4} />
            </>
          )}
          <Typography variant="body" size="small" color="neutral800">
            {getConciseAddress(
              address,
              WALLET_ADDRESS_MAX_CHARS,
              WALLET_ADDRESS_ELLIPSIS_LENGTH
            )}
          </Typography>
          <Divider direction="horizontal" size={8} />
          <EditIcon size={16} color="info" />
        </div>
      )}
    </WalletButton>
  );
}
