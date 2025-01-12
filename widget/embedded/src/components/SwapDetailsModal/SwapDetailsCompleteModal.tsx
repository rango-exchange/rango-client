import type { CompleteModalPropTypes } from './SwapDetailsModal.types';

import { i18n } from '@lingui/core';
import {
  Button,
  Divider,
  MessageBox,
  TokenAmount,
  Typography,
} from '@rango-dev/ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { WIDGET_UI_ID } from '../../constants';
import { useUiStore } from '../../store/ui';
import { getContainer } from '../../utils/common';
import { WatermarkedModal } from '../common/WatermarkedModal';

export function SwapDetailsCompleteModal(props: CompleteModalPropTypes) {
  const {
    open,
    onClose,
    status,
    priceValue,
    usdValue,
    realUsdValue,
    realValue,
    token,
    chain,
    percentageChange,
    description,
    diagnosisUrl,
  } = props;
  const navigate = useNavigate();
  const { showProfileBanner } = useUiStore();

  return (
    <WatermarkedModal
      open={open}
      onClose={onClose}
      container={
        document.getElementById(WIDGET_UI_ID.SWAP_BOX_ID) || document.body
      }>
      {status === 'success' ? (
        <MessageBox type="success" title={i18n.t('Swap Successful')}>
          <TokenAmount
            direction="vertical"
            tooltipContainer={getContainer()}
            type="output"
            centerAlign={true}
            price={{
              value: priceValue,
              usdValue,
              realUsdValue,
              realValue,
            }}
            token={token}
            chain={chain}
            percentageChange={percentageChange}
          />
          <Divider size={12} />
          <Typography
            variant="body"
            size="medium"
            color="neutral700"
            align="center">
            {description}
          </Typography>
        </MessageBox>
      ) : (
        <MessageBox
          type="error"
          title={i18n.t('Transaction Failed')}
          description={description}
        />
      )}
      <Divider size={30} />
      {status === 'success' && (
        <>
          {showProfileBanner && (
            <>
              <img
                src={
                  'https://raw.githubusercontent.com/rango-exchange/assets/main/banners/widget/profile.png'
                }
                alt="Profile Banner"
              />
              <Divider size={30} />
            </>
          )}
          <Button
            id="widget-swap-details-modal-done-btn"
            variant="contained"
            type="primary"
            size="large"
            onClick={() => {
              const home = '../../';
              navigate(home);
            }}>
            {i18n.t('Done')}
          </Button>
        </>
      )}
      <Divider size={12} />
      {diagnosisUrl && (
        <>
          <Button
            variant="contained"
            id="widget-swap-detail-modal-diagnosis-btn"
            type="primary"
            size="large"
            onClick={() => window.open(diagnosisUrl, '_blank')}>
            {i18n.t('Diagnosis')}
          </Button>
          <Divider size={12} />
        </>
      )}
      <Button
        id="widget-swap-details-modal-see-details-btn"
        variant="outlined"
        type="primary"
        size="large"
        onClick={onClose}>
        <Typography variant="title" size="medium" color="primary">
          {i18n.t('See Details')}
        </Typography>
      </Button>
    </WatermarkedModal>
  );
}
