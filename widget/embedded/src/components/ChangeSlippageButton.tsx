import React from 'react';
import { Button } from '@rango-dev/ui';
import { useNavigate } from 'react-router-dom';
import { navigationRoutes } from '../constants/navigationRoutes';
import { i18n } from '@lingui/core';

export function ChangeSlippageButton() {
  const navigate = useNavigate();

  return (
    <Button
      type="primary"
      variant="outlined"
      size="small"
      onClick={() => navigate('/' + navigationRoutes.settings)}>
      {i18n.t('Change Slippage')}
    </Button>
  );
}
