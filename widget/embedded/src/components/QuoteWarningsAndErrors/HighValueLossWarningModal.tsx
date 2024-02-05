import type { HighValueLossWarning } from '../../types';

import { i18n } from '@lingui/core';
import {
  Button,
  Divider,
  MessageBox,
  Typography,
  WarningIcon,
} from '@rango-dev/ui';
import React from 'react';

import { errorMessages } from '../../constants/errors';
import {
  GAS_FEE_MAX_DECIMALS,
  GAS_FEE_MIN_DECIMALS,
  PERCENTAGE_CHANGE_MAX_DECIMALS,
  PERCENTAGE_CHANGE_MIN_DECIMALS,
  USD_VALUE_MAX_DECIMALS,
  USD_VALUE_MIN_DECIMALS,
} from '../../constants/routing';
import { getContainer } from '../../utils/common';
import { numberToString } from '../../utils/numbers';
import { WatermarkedModal } from '../common/WatermarkedModal';

import { QuoteErrorsModalItem } from './QuoteErrorsModalItem';
import { Flex } from './QuoteWarningsAndErrors.styles';

type Props = {
  open: boolean;
  confirmationDisabled: boolean;
  onClose: () => void;
  onConfirm: () => void;
  warning: HighValueLossWarning;
};

export function HighValueLossWarningModal(props: Props) {
  const { open, onClose, onConfirm, warning, confirmationDisabled } = props;
  const type = warning.warningLevel === 'high' ? 'error' : 'warning';

  const highValueLossData = [
    {
      title: i18n.t('Swapping'),
      value: numberToString(
        warning.inputUsdValue,
        USD_VALUE_MIN_DECIMALS,
        USD_VALUE_MAX_DECIMALS
      ),
    },
    {
      title: i18n.t('Gas cost'),
      value: numberToString(
        warning.totalFee,
        GAS_FEE_MIN_DECIMALS,
        GAS_FEE_MAX_DECIMALS
      ),
    },
    {
      title: i18n.t('Receiving'),
      value: numberToString(
        warning.outputUsdValue,
        USD_VALUE_MIN_DECIMALS,
        USD_VALUE_MAX_DECIMALS
      ),
    },
    {
      title: i18n.t('Price impact'),
      value: numberToString(
        warning.priceImpact,
        PERCENTAGE_CHANGE_MIN_DECIMALS,
        PERCENTAGE_CHANGE_MAX_DECIMALS
      ),
      valueColor: `${type}500`,
    },
  ];

  return (
    <WatermarkedModal open={open} onClose={onClose} container={getContainer()}>
      <MessageBox
        type={type}
        title={errorMessages().highValueLossError.impactTitle}
        description={errorMessages().highValueLossError.description}
      />

      <Flex>
        <Divider size={20} />
        <Typography size="small" variant="title">
          {i18n.t('Details')}
        </Typography>
        <Flex>
          {highValueLossData.map((item, index) => {
            const key = index;
            return <QuoteErrorsModalItem key={key} {...item} />;
          })}
        </Flex>
      </Flex>

      <Divider size={32} />
      <Button
        type="primary"
        size="large"
        prefix={<WarningIcon />}
        fullWidth
        disabled={confirmationDisabled}
        onClick={onConfirm}>
        {errorMessages().highValueLossError.confirmMessage}
      </Button>
    </WatermarkedModal>
  );
}
