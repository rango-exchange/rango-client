import type {
  PropTypes,
  WalletRequiredAssetReason,
} from './InsufficientBalanceModal.types';

import { i18n } from '@lingui/core';
import { Button, Divider, Image, MessageBox, Typography } from '@rango-dev/ui';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetSelectedWalletForBlockchain } from '../../hooks/useGetSelectedWalletForBlockchain';
import { getContainer } from '../../utils/common';
import { WatermarkedModal } from '../common/WatermarkedModal';

import { sortByReason } from './InsufficentBalanceModal.helpers';
import {
  modalStyles,
  Separator,
  WalletWarningItem,
} from './InsufficientBalanceModal.styles';
import { InsufficientBalanceWarning } from './InsufficientBalanceWarning';

export function InsufficientBalanceModal(props: PropTypes) {
  const { open, onClose, onConfirm, warnings } = props;
  const { t } = useTranslation();
  const { getSelectedWalletInfo } = useGetSelectedWalletForBlockchain();

  const warningItemReason: Record<WalletRequiredAssetReason, string> = {
    FEE: t('Network fee'),
    INPUT_ASSET: t('Balance'),
    FEE_AND_INPUT_ASSET: t('Balance & Network fee'),
  };

  if (!warnings) {
    return null;
  }

  return (
    <WatermarkedModal
      id="widget-confirm-wallets-insufficient-account-balance-modal"
      open={open}
      onClose={onClose}
      container={getContainer()}
      styles={modalStyles}
      footer={
        <Button
          id="widget-confirm-wallet-modal-proceed-anyway-btn"
          variant="outlined"
          size="large"
          type="primary"
          fullWidth
          onClick={onConfirm}>
          {i18n.t('Proceed Anyway')}
        </Button>
      }>
      <MessageBox title={i18n.t('Insufficient balance')} type="warning">
        {Object.entries(warnings).map(([blockchain, messages]) => {
          const selectedWalletInfo = getSelectedWalletInfo(blockchain);
          if (!selectedWalletInfo) {
            return null;
          }
          return (
            <Fragment key={blockchain}>
              <Divider size="20" direction="vertical" />
              <WalletWarningItem>
                <div className="wallet-info">
                  <Image src={selectedWalletInfo.img} size={20} />
                  <Typography variant="title" size="small">
                    {selectedWalletInfo.name}
                  </Typography>
                </div>
                <Divider size={12} />
                {messages.sort(sortByReason).map((message, index) => {
                  const showSeparator =
                    messages.length > 1 && index !== messages.length - 1;

                  return (
                    <Fragment key={message.blockchain + message.asset.symbol}>
                      <InsufficientBalanceWarning
                        warning={{
                          title: warningItemReason[message.reason],
                          assetSymbol: message.asset.symbol,
                          requiredBalance: message.requiredAmount,
                          userBalance: message.currentAmount,
                        }}
                      />
                      {showSeparator && <Separator />}
                    </Fragment>
                  );
                })}
              </WalletWarningItem>
            </Fragment>
          );
        })}
      </MessageBox>
    </WatermarkedModal>
  );
}
