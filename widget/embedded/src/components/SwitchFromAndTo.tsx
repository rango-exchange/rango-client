import { ReverseIcon, styled } from '@rango-dev/ui';
import React from 'react';

import { useQuoteStore } from '../store/quote';

const SwitchButtonContainer = styled('div', {
  position: 'absolute',
  bottom: '-12px',
  left: '50%',
  transform: 'translate(-50%, 10%)',
  cursor: 'pointer',
});

const StyledButton = styled('div', {
  borderRadius: '$md',
  border: '3px solid $background',
  background: '$neutral100',
  width: '$24',
  height: '$24',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '$foreground',
  '&:hover': {
    color: '$secondary500',
  },
});

export function SwitchFromAndToButton() {
  const switchFromAndTo = useQuoteStore.use.switchFromAndTo();

  return (
    <SwitchButtonContainer>
      <StyledButton
        onClick={() => {
          switchFromAndTo();
        }}>
        <ReverseIcon size={12} />
      </StyledButton>
    </SwitchButtonContainer>
  );
}
