import React from 'react';
import { Button } from '@rango-dev/ui';
import { useNavigate } from 'react-router-dom';
import { navigationRoutes } from '../constants/navigationRoutes';

export function ChangeSlippageButton() {
  const navigate = useNavigate();

  return (
    <Button
      type="primary"
      variant="outlined"
      size="small"
      onClick={() => navigate('/' + navigationRoutes.settings)}
    >
      Change Slippage
    </Button>
  );
}
