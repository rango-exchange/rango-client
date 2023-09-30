import React from 'react';

import { HeaderContainer, StyledButton } from './ConfigContainer.styles';

export function Header() {
  return (
    <HeaderContainer>
      <StyledButton type="secondary" size="medium" variant="contained">
        Export Code
      </StyledButton>
    </HeaderContainer>
  );
}
