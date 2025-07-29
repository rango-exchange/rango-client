import { ReverseIcon } from '@rango-dev/ui';
import React from 'react';

import { useSwapMode } from '../../hooks/useSwapMode';
import { useAppStore } from '../../store/AppStore';
import { useQuoteStore } from '../../store/quote';

import {
  ROTATE_ANIMATION_DURATION,
  StyledButton,
  SwitchButtonContainer,
} from './SwitchFromAndTo.styles';

export function SwitchFromAndToButton() {
  const switchFromAndTo = useQuoteStore.use.switchFromAndTo();
  const fromBlockchain = useQuoteStore.use.fromBlockchain();
  const { findNativeToken } = useAppStore();
  const swapMode = useSwapMode();

  return (
    <SwitchButtonContainer>
      <StyledButton
        id="widget-switch-from-and-to-btn"
        onClick={(event) => {
          const button = event.currentTarget;

          button.classList.add('rotate');

          setTimeout(() => {
            button.classList.remove('rotate');
          }, ROTATE_ANIMATION_DURATION);
          switchFromAndTo({
            toToken:
              swapMode === 'refuel' && !!fromBlockchain
                ? findNativeToken(fromBlockchain)
                : undefined,
          });
        }}>
        <ReverseIcon size={12} />
      </StyledButton>
    </SwitchButtonContainer>
  );
}
