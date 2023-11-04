import type { ModalPropTypes } from './RouteErrors.types';

import { i18n } from '@lingui/core';
import {
  Button,
  Divider,
  MessageBox,
  Modal,
  Typography,
  WarningIcon,
} from '@rango-dev/ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { errorMessages } from '../../constants/errors';
import { navigationRoutes } from '../../constants/navigationRoutes';
import {
  GAS_FEE_MAX_DECIMALS,
  GAS_FEE_MIN_DECIMALS,
  HIGHT_PRICE_IMPACT,
  PERCENTAGE_CHANGE_MAX_DECIMALS,
  PERCENTAGE_CHANGE_MIN_DECIMALS,
  USD_VALUE_MAX_DECIMALS,
  USD_VALUE_MIN_DECIMALS,
} from '../../constants/routing';
import { numberToString } from '../../utils/numbers';

import { Flex } from './RouteErrors.styles';
import { RouteErrorsModalItem } from './RouteErrorsModalItem';

export function RouteErrorsModal(props: ModalPropTypes) {
  const {
    highValueLoss,
    open,
    onToggle,
    percentageChange,
    inputUsdValue,
    outputUsdValue,
    totalFeeInUsd,
  } = props;
  const navigate = useNavigate();
  const type =
    highValueLoss && !!percentageChange?.lt(HIGHT_PRICE_IMPACT)
      ? 'error'
      : 'warning';
  const highValueLossData = [
    {
      title: i18n.t('Swapping'),
      value: numberToString(
        inputUsdValue,
        USD_VALUE_MIN_DECIMALS,
        USD_VALUE_MAX_DECIMALS
      ),
    },
    {
      title: i18n.t('Gas cost'),
      value: numberToString(
        totalFeeInUsd,
        GAS_FEE_MIN_DECIMALS,
        GAS_FEE_MAX_DECIMALS
      ),
    },
    {
      title: i18n.t('Receiving'),
      value: numberToString(
        outputUsdValue,
        USD_VALUE_MIN_DECIMALS,
        USD_VALUE_MAX_DECIMALS
      ),
    },
    {
      title: i18n.t('Price impact'),
      value: numberToString(
        percentageChange,
        PERCENTAGE_CHANGE_MIN_DECIMALS,
        PERCENTAGE_CHANGE_MAX_DECIMALS
      ),
      valueColor: `${type}500`,
    },
  ];

  return (
    <Modal
      open={open}
      onClose={() => onToggle(false)}
      container={document.getElementById('swap-box') || document.body}>
      {highValueLoss ? (
        <MessageBox
          type={type}
          title={errorMessages().highValueLossError.impactTitle}
          description={errorMessages().highValueLossError.description}
        />
      ) : (
        <MessageBox
          type={type}
          title={errorMessages().unknownPriceError.impactTitle}
          description={errorMessages().unknownPriceError.description}
        />
      )}
      {highValueLoss && (
        <Flex>
          <Divider size={20} />
          <Typography size="small" variant="title">
            {i18n.t('Details')}
          </Typography>
          <Flex>
            {highValueLossData.map((item, index) => {
              const key = index;
              return <RouteErrorsModalItem key={key} {...item} />;
            })}
          </Flex>
        </Flex>
      )}
      <Divider size={32} />
      <Button
        type="primary"
        size="large"
        prefix={<WarningIcon />}
        fullWidth
        onClick={() => {
          navigate(navigationRoutes.confirmSwap);
        }}>
        {highValueLoss
          ? errorMessages().highValueLossError.confirmMessage
          : errorMessages().unknownPriceError.confirmMessage}
      </Button>
    </Modal>
  );
}
