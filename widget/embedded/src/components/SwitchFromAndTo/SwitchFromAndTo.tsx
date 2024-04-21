import { ReverseIcon } from '@rango-dev/ui';
import React from 'react';

import { useQuoteStore } from '../../store/quote';

import {
  ROTATE_ANIMATION_DURATION,
  StyledButton,
  SwitchButtonContainer,
} from './SwitchFromAndTo.styles';

export function SwitchFromAndToButton() {
  const switchFromAndTo = useQuoteStore.use.switchFromAndTo();

  return (
    <SwitchButtonContainer>
      <StyledButton
        onClick={(event) => {
          const button = event.currentTarget;

          button.classList.add('rotate');

          setTimeout(() => {
            button.classList.remove('rotate');
          }, ROTATE_ANIMATION_DURATION);
          switchFromAndTo();
        }}>
        <ReverseIcon size={12} />
      </StyledButton>
    </SwitchButtonContainer>
  );
}
