import { ReverseIcon } from '@rango-dev/ui';
import React from 'react';

import { useAppStore } from '../../store/AppStore';
import { useQuoteStore } from '../../store/quote';

import {
  ROTATE_ANIMATION_DURATION,
  StyledButton,
  SwitchButtonContainer,
} from './SwitchFromAndTo.styles';

export function SwitchFromAndToButton() {
  const switchFromAndTo = useQuoteStore().use.switchFromAndTo();
  const sourceWallet = useAppStore().selectedWallet('source');
  const destinationWallet = useAppStore().selectedWallet('destination');
  const { customDestination } = useQuoteStore()();
  const { setSelectedWallet, clearSelectedWallet } = useAppStore();

  const switchSelectedWallets = () => {
    if (sourceWallet) {
      setSelectedWallet({
        kind: 'destination',
        wallet: {
          blockchain: sourceWallet.chain,
          type: sourceWallet.walletType,
          address: sourceWallet.address,
        },
      });
    } else {
      clearSelectedWallet('destination');
    }
    if (customDestination || !destinationWallet) {
      clearSelectedWallet('source');
    } else {
      setSelectedWallet({
        kind: 'source',
        wallet: {
          blockchain: destinationWallet.chain,
          type: destinationWallet.walletType,
          address: destinationWallet.address,
        },
      });
    }
  };

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
          switchFromAndTo();
          setTimeout(() => {
            switchSelectedWallets();
          }, 0);
        }}>
        <ReverseIcon size={12} />
      </StyledButton>
    </SwitchButtonContainer>
  );
}
