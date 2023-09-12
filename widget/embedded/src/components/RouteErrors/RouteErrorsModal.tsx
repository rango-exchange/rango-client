import type { ModalPropTypes } from './RouteErrors.types';

import {
  BottomLogo,
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
import { numberToString } from '../../utils/numbers';

import { Flex } from './RouteErrors.styles';
import { RouteErrorsModalItem } from './RouteErrorsModalItem';

const WARNING_LEVEL_LIMIT = -10;
const MAX_DECIMAL = 2;
const MIN_DECIMAL = 0;

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
    highValueLoss && !!percentageChange?.lt(WARNING_LEVEL_LIMIT)
      ? 'error'
      : 'warning';
  const highValueLossData = [
    { title: 'Swapping', value: numberToString(inputUsdValue) },
    {
      title: 'Gas cost',
      value: numberToString(totalFeeInUsd, MIN_DECIMAL, MAX_DECIMAL),
    },
    { title: 'Receiving', value: numberToString(outputUsdValue) },
    {
      title: 'Price impact',
      value: numberToString(percentageChange, MIN_DECIMAL, MAX_DECIMAL),
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
          title={errorMessages.highValueLossError.impacTitle}
          description={errorMessages.highValueLossError.description}
        />
      ) : (
        <MessageBox
          type={type}
          title={errorMessages.unknownPriceError.impacTitle}
          description={errorMessages.unknownPriceError.description}
        />
      )}
      {highValueLoss && (
        <Flex>
          <Divider size={20} />
          <Typography size="small" variant="title">
            Details
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
          ? errorMessages.highValueLossError.confirmMessage
          : errorMessages.unknownPriceError.confirmMessage}
      </Button>
      <Divider size={12} />
      <BottomLogo />
    </Modal>
  );
}
