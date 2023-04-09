import React from 'react';
import { Button, styled } from '@rango-dev/ui';
import { useNavigate } from 'react-router-dom';
import { navigationRoutes } from '../constants/navigationRoutes';

const StyledButton = styled(Button, {
  marginTop: '$8',
});

export function ChangeSlippageButton() {
  const navigate = useNavigate();

  return (
    <StyledButton
      type="primary"
      variant="contained"
      size="small"
      onClick={() => navigate(navigationRoutes.settings)}
    >
      Change Slippage
    </StyledButton>
  );
}
