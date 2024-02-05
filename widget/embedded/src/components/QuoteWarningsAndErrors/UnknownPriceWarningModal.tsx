import type { UnknownPriceWarning } from '../../types';

import { Button, Divider, MessageBox, WarningIcon } from '@rango-dev/ui';
import React from 'react';

import { errorMessages } from '../../constants/errors';
import { getContainer } from '../../utils/common';
import { WatermarkedModal } from '../common/WatermarkedModal';

type Props = {
  open: boolean;
  confirmationDisabled: boolean;
  onClose: () => void;
  onConfirm: () => void;
  warning: UnknownPriceWarning;
};

export function UnknownPriceWarningModal(props: Props) {
  const { open, onClose, onConfirm, confirmationDisabled } = props;
  return (
    <WatermarkedModal open={open} onClose={onClose} container={getContainer()}>
      <MessageBox
        type="warning"
        title={errorMessages().unknownPriceError.impactTitle}
        description={errorMessages().unknownPriceError.description}
      />

      <Divider size={32} />
      <Button
        type="primary"
        size="large"
        prefix={<WarningIcon />}
        fullWidth
        disabled={confirmationDisabled}
        onClick={onConfirm}>
        {errorMessages().unknownPriceError.confirmMessage}
      </Button>
    </WatermarkedModal>
  );
}
