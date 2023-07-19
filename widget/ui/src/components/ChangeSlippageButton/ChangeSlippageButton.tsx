import React from 'react';
import { Button } from '../Button';
import { i18n } from '@lingui/core';

interface PropTypes {
  onClick: () => void;
}

export function ChangeSlippageButton(props: PropTypes) {
  const { onClick } = props;

  return (
    <Button type="primary" variant="outlined" size="small" onClick={onClick}>
      {i18n.t('Change Slippage')}
    </Button>
  );
}
