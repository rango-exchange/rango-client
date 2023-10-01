import { Divider } from '@rango-dev/ui';
import React from 'react';

import { useConfigStore } from '../../store/config';

import {
  HeaderContainer,
  ResetButton,
  StyledButton,
} from './ConfigContainer.styles';

export function Header() {
  const resetConfig = useConfigStore.use.resetConfig();

  return (
    <HeaderContainer>
      <ResetButton
        type="secondary"
        size="medium"
        variant="ghost"
        onClick={resetConfig.bind(null)}>
        Reset Configuration
      </ResetButton>
      <Divider direction="horizontal" size={16} />
      <StyledButton type="secondary" size="medium" variant="contained">
        Export Code
      </StyledButton>
    </HeaderContainer>
  );
}
